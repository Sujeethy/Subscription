-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 08, 2024 at 01:36 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Database: `xyz_enterprises`
--

-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `CustID` varchar(20) NOT NULL UNIQUE KEY,
  `Name` varchar(50) NOT NULL,
  `PAN` char(10) DEFAULT NULL CHECK (`PAN` regexp '^[A-Z]{5}[0-9]{4}[A-Z]{1}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table `customer`
--

INSERT INTO `customer` (`CustID`, `Name`, `PAN`) VALUES
('CUST001', 'John Doe', 'ABCDE1234F'),
('CUST002', 'Jane Smith', 'FGHIJ5678K'),
('CUST003', 'Alice Johnson', 'LMNOP9876Q');

-- Table structure for table `product`
--

CREATE TABLE `product` (
  `ProdID` varchar(20) NOT NULL UNIQUE KEY,
  `ProdName` varchar(50) NOT NULL UNIQUE,
  `Description` varchar(255) DEFAULT NULL,
  `AnnualCost` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table `product`
--

INSERT INTO `product` (`ProdID`, `ProdName`, `Description`, `AnnualCost`) VALUES
('PROD001', 'Amazon Prime', 'Online Shopping and Streaming', 100),
('PROD002', 'Netflix', 'Streaming Service', 120),
('PROD003', 'Spotify', 'Music Streaming Service', 60);

-- Table structure for table `subscription`
--

CREATE TABLE `subscription` (
  `SubID` int(11) NOT NULL AUTO_INCREMENT,
  `CustID` varchar(20) DEFAULT NULL,
  `ProdID` varchar(20) DEFAULT NULL,
  `StartDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  `NoUsers` int(11) DEFAULT NULL,
  PRIMARY KEY (`SubID`),
  FOREIGN KEY (`CustID`) REFERENCES `customer`(`CustID`),
  FOREIGN KEY (`ProdID`) REFERENCES `product`(`ProdID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table `subscription`
--

INSERT INTO `subscription` (`SubID`, `CustID`, `ProdID`, `StartDate`, `EndDate`, `NoUsers`) VALUES
(1, 'CUST003', 'PROD002', '2024-08-06', '2024-08-08', 1),
(2, 'CUST001', 'PROD002', '2024-08-14', '2024-08-08', 1),
(3, 'CUST002', 'PROD001', '2024-08-08', '2024-10-06', 0),
(4, 'CUST001', 'PROD001', '2024-08-08', '2024-08-07', 1),
(5, 'CUST002', 'PROD002', '2024-08-21', '2024-08-30', 1),
(6, 'CUST003', 'PROD003', '2024-08-09', '2024-08-15', 1),
(7, 'CUST001', 'PROD003', '2024-08-08', '2024-08-17', 1);

COMMIT;
