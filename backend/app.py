from flask import Flask, request, jsonify, make_response
from flask_restful import Api, Resource, reqparse
from flask_mysqldb import MySQL
from datetime import datetime, timedelta
from flask_cors import CORS
import traceback

app = Flask(__name__)
CORS(app)

api = Api(app)

# Database configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'xyz_enterprises'

mysql = MySQL(app)

def get_db_cursor():
    return mysql.connection.cursor()

def jsonify_with_status(data, status=200):
    return make_response(jsonify(data), status)

class Subscription(Resource):
    def get(self):
        cur = None
        try:
            cur = get_db_cursor()
            cur.execute("SELECT Subscription.*, Customer.CustID, Customer.Name FROM Subscription JOIN Customer ON Subscription.CustID = Customer.CustID")
            subs = cur.fetchall()
            subs_with_fields = [dict(zip([column[0] for column in cur.description], row)) for row in subs]
            return jsonify(subs_with_fields)
        except Exception as e:
            error_message = f"Error fetching subscriptions: {e}"
            print(error_message)
            print(traceback.format_exc())
            return jsonify_with_status({'message': 'An error occurred', 'error': str(e)}, 500)
        finally:
            if cur:
                cur.close()

    def post(self):
        cur = None
        try:
            data = request.json
            cust_id = data.get('CustID')
            prod_name = data.get('ProdName')
            start_date = data.get('StartDate')
            end_date = data.get('EndDate')
            no_users = data.get('NoUsers')

            if not all([cust_id, prod_name, start_date, end_date, no_users]):
                return jsonify_with_status({'message': 'All fields are required'}, 400)

            cur = get_db_cursor()
            cur.execute("SELECT * FROM SUBSCRIPTION WHERE CustID=%s AND ProdName=%s AND EndDate >= CURDATE()", (cust_id, prod_name))
            existing_sub = cur.fetchone()

            if existing_sub:
                return jsonify_with_status({'message': 'Active subscription already exists'}, 400)

            cur.execute("INSERT INTO SUBSCRIPTION(CustID, ProdName, StartDate, EndDate, NoUsers) VALUES (%s, %s, %s, %s, %s)",
                        (cust_id, prod_name, start_date, end_date, no_users))
            mysql.connection.commit()
            return jsonify_with_status({'message': 'Subscription added successfully'}, 201)

        except Exception as e:
            error_message = f"Error adding subscription: {e}"
            print(error_message)
            print(traceback.format_exc())
            return jsonify_with_status({'message': 'An error occurred', 'error': str(e)}, 500)
        finally:
            if cur:
                cur.close()

class ExtendSubscription(Resource):
    def put(self, sub_id):
        cur = None
        try:
            data = request.json
            new_end_date = data.get('EndDate')

            if not new_end_date:
                return jsonify_with_status({'message': 'New end date is required'}, 400)

            cur = get_db_cursor()
            cur.execute("UPDATE SUBSCRIPTION SET EndDate = %s WHERE SubID = %s", (new_end_date, sub_id))
            mysql.connection.commit()
            return jsonify({'status': 'success', 'message': f'Subscription {sub_id} extended to {new_end_date}'})
        except Exception as e:
            error_message = f"Error extending subscription: {e}"
            print(error_message)
            print(traceback.format_exc())
            return jsonify_with_status({'message': 'An error occurred', 'error': str(e)}, 500)
        finally:
            if cur:
                cur.close()

class EndSubscription(Resource):
    def put(self, sub_id):
        cur = None
        try:
            today = datetime.now().strftime('%Y-%m-%d')

            cur = get_db_cursor()
            cur.execute("UPDATE SUBSCRIPTION SET EndDate = %s WHERE SubID = %s", (today, sub_id))
            mysql.connection.commit()
            return jsonify({'status': 'success', 'message': f'Subscription {sub_id} ended successfully'})
        except Exception as e:
            error_message = f"Error ending subscription: {e}"
            print(error_message)
            print(traceback.format_exc())
            return jsonify_with_status({'message': 'An error occurred', 'error': str(e)}, 500)
        finally:
            if cur:
                cur.close()

class CustomerList(Resource):
    def get(self):
        cur = None
        try:
            cur = get_db_cursor()
            cur.execute("SELECT CustID, Name FROM CUSTOMER")
            customers = cur.fetchall()
            customers_with_fields = [dict(zip([column[0] for column in cur.description], row)) for row in customers]
            return jsonify(customers_with_fields)
        except Exception as e:
            error_message = f"Error fetching customers: {e}"
            print(error_message)
            print(traceback.format_exc())
            return jsonify_with_status({'message': 'An error occurred', 'error': str(e)}, 500)
        finally:
            if cur:
                cur.close()

class ProductList(Resource):
    def get(self):
        cur = None
        try:
            cur = get_db_cursor()
            cur.execute("SELECT ProdName FROM PRODUCT")
            products = cur.fetchall()
            products_with_fields = [dict(zip([column[0] for column in cur.description], row)) for row in products]
            return jsonify(products_with_fields)
        except Exception as e:
            error_message = f"Error fetching products: {e}"
            print(error_message)
            print(traceback.format_exc())
            return jsonify_with_status({'message': 'An error occurred', 'error': str(e)}, 500)
        finally:
            if cur:
                cur.close()

class MultiExtend(Resource):
    def put(self):
        cur = None
        try:
            data = request.json
            days = data.get('extendedbydays')
            new_end_date = data.get('extendedbydate')
            sub_ids = data.get('selectedSubscriptions')

            if not sub_ids:
                return jsonify_with_status({'message': 'No subscription IDs provided'}, 400)

            cur = get_db_cursor()

            if days:
                placeholders = ', '.join(['%s'] * len(sub_ids))
                query = f"UPDATE SUBSCRIPTION SET EndDate = DATE_ADD(EndDate, INTERVAL %s DAY) WHERE SubID IN ({placeholders})"
                cur.execute(query, (days, *sub_ids))
            elif new_end_date:
                placeholders = ', '.join(['%s'] * len(sub_ids))
                query = f"UPDATE SUBSCRIPTION SET EndDate = %s WHERE SubID IN ({placeholders})"
                cur.execute(query, (new_end_date, *sub_ids))
            else:
                return jsonify_with_status({'message': 'No update parameters provided'}, 400)

            mysql.connection.commit()
            return jsonify({'message': 'Subscriptions updated successfully'})
        except Exception as e:
            error_message = f"Error updating subscriptions: {e}"
            print(error_message)
            print(traceback.format_exc())
            return jsonify_with_status({'message': 'An error occurred', 'error': str(e)}, 500)
        finally:
            if cur:
                cur.close()

class MultiEnd(Resource):
    def put(self):
        cur = None
        try:
            data = request.json
            sub_ids = data.get('selectedSubscriptions')
            today = datetime.now().strftime('%Y-%m-%d')

            if not sub_ids:
                return jsonify_with_status({'message': 'No subscription IDs provided'}, 400)

            placeholders = ', '.join(['%s'] * len(sub_ids))
            query = f"UPDATE SUBSCRIPTION SET EndDate=%s WHERE SubID IN ({placeholders})"

            cur = get_db_cursor()
            cur.execute(query, (today, *sub_ids))
            mysql.connection.commit()
            return jsonify({'message': 'Subscriptions ended successfully'})
        except Exception as e:
            error_message = f"Error ending subscriptions: {e}"
            print(error_message)
            print(traceback.format_exc())
            return jsonify_with_status({'message': 'An error occurred', 'error': str(e)}, 500)
        finally:
            if cur:
                cur.close()

class RevenueReport(Resource):
    def get(self):
        cur = None
        try:
            filter_option = request.args.get('filter', 'all')
            cur = get_db_cursor()
            
            if filter_option == '3_months':
                start_date = (datetime.now() - timedelta(days=90)).strftime('%Y-%m-%d')
            elif filter_option == '1_month':
                start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
            else:
                start_date = '1970-01-01'
            
            query = """
                SELECT SUBSCRIPTION.ProdName, SUM(AnnualCost * NoUsers) AS Revenue
                FROM SUBSCRIPTION
                JOIN PRODUCT ON SUBSCRIPTION.ProdName = PRODUCT.ProdName
                WHERE EndDate >= %s
                GROUP BY ProdName
            """
            cur.execute(query, (start_date,))
            report = cur.fetchall()
            report_with_fields = [dict(zip([column[0] for column in cur.description], row)) for row in report]
            return jsonify(report_with_fields)
        
        except Exception as e:
            error_message = f"Error fetching revenue report: {e}"
            print(error_message)
            print(traceback.format_exc())
            return jsonify_with_status({'message': 'An error occurred', 'error': str(e)}, 500)
        finally:
            if cur:
                cur.close()

api.add_resource(Subscription, '/subscriptions')
api.add_resource(ExtendSubscription, '/subscriptions/extend/<int:sub_id>')
api.add_resource(EndSubscription, '/subscriptions/end/<int:sub_id>')
api.add_resource(RevenueReport, '/report/revenue')
api.add_resource(CustomerList, '/customers')
api.add_resource(ProductList, '/products')
api.add_resource(MultiExtend, '/multiextend')
api.add_resource(MultiEnd, '/multiend')

if __name__ == '__main__':
    app.run(debug=True)
