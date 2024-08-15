-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 14, 2024 at 11:35 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `xyz_enterprises`
--

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `CustID` varchar(20) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `PAN` char(10) DEFAULT NULL CHECK (`PAN` regexp '^[A-Z]{5}[0-9]{4}[A-Z]{1}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`CustID`, `Name`, `PAN`) VALUES
('CUST001', 'John Doe', 'ABCDE1234F'),
('CUST002', 'Jane Smith', 'FGHIJ5678K'),
('CUST003', 'Alice Johnson', 'LMNOP9876Q');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `ProdName` varchar(50) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `AnnualCost` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`ProdName`, `Description`, `AnnualCost`) VALUES
('Amazon Prime', 'Online Shopping and Streaming', 100),
('Netflix', 'Streaming Service', 120),
('Spotify', 'Music Streaming Service', 60);

-- --------------------------------------------------------

--
-- Table structure for table `subscription`
--

CREATE TABLE `subscription` (
  `SubID` int(11) NOT NULL,
  `CustID` varchar(20) DEFAULT NULL,
  `ProdName` varchar(50) DEFAULT NULL,
  `StartDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  `NoUsers` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subscription`
--

INSERT INTO `subscription` (`SubID`, `CustID`, `ProdName`, `StartDate`, `EndDate`, `NoUsers`) VALUES
(1, 'CUST003', 'Netflix', '2024-08-06', '2024-08-15', 1),
(3, 'CUST002', 'Amazon Prime', '2024-08-08', '2024-08-15', 2),
(5, 'CUST002', 'Netflix', '2024-08-21', '2024-08-15', 1);


--
-- Indexes for dumped tables
--

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`CustID`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`ProdName`);

--
-- Indexes for table `subscription`
--
ALTER TABLE `subscription`
  ADD PRIMARY KEY (`SubID`),
  ADD KEY `CustID` (`CustID`),
  ADD KEY `ProdName` (`ProdName`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `subscription`
--
ALTER TABLE `subscription`
  MODIFY `SubID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `subscription`
--
ALTER TABLE `subscription`
  ADD CONSTRAINT `subscription_ibfk_1` FOREIGN KEY (`CustID`) REFERENCES `customer` (`CustID`),
  ADD CONSTRAINT `subscription_ibfk_2` FOREIGN KEY (`ProdName`) REFERENCES `product` (`ProdName`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
