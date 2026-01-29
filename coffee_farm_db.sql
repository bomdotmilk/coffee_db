-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 29, 2026 at 04:36 AM
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
-- Database: `coffee_farm_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('superadmin','staff') DEFAULT 'staff',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `username`, `password`, `fullname`, `email`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin01', '$2a$10$ABCDEFGHIJKLMNOPQRSTUVabcdefghijklmnopqrstuvwxyz012345', 'ผู้ดูแลระบบหลัก', 'admin01@email.com', 'superadmin', '2026-01-28 10:05:54', '2026-01-28 10:05:54'),
(2, 'admin02', '$2a$10$ABCDEFGHIJKLMNOPQRSTUVabcdefghijklmnopqrstuvwxyz012345', 'เจ้าหน้าที่ระบบ', 'admin02@email.com', 'staff', '2026-01-28 10:05:54', '2026-01-28 10:05:54');

-- --------------------------------------------------------

--
-- Table structure for table `coffee_farm`
--

CREATE TABLE `coffee_farm` (
  `farm_id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `farm_name` varchar(100) NOT NULL,
  `house_no` varchar(20) DEFAULT NULL,
  `village` varchar(100) DEFAULT NULL,
  `sub_district` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `area_size` decimal(10,2) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coffee_farm`
--

INSERT INTO `coffee_farm` (`farm_id`, `owner_id`, `farm_name`, `house_no`, `village`, `sub_district`, `district`, `postal_code`, `area_size`, `latitude`, `longitude`, `description`, `created_at`, `updated_at`) VALUES
(41, 1, 'ไร่กาแฟภูเลย Organic', '123', 'บ้านภูเขียว', 'กกดู่', 'เมืองเลย', '42000', 25.50, 17.49502300, 101.74814500, 'ไร่กาแฟอาราบิก้าอินทรีย์บนพื้นที่สูง ปลูกแบบยั่งยืน', '2026-01-28 10:28:19', '2026-01-28 10:28:19'),
(42, 2, 'สวนกาแฟภูเรือ Premium', '45', 'บ้านห้วยน้ำใส', 'หนองบัว', 'ภูเรือ', '42160', 18.00, 17.46321000, 101.36987600, 'สวนกาแฟพรีเมียมปลูกในร่มเงาต้นไม้ใหญ่', '2026-01-28 10:28:19', '2026-01-28 10:28:19'),
(43, 12, 'ไร่กาแฟเชียงคาน Valley', '67', 'บ้านดงมะไฟ', 'เชียงคาน', 'เชียงคาน', '42110', 32.00, 17.87452300, 101.66543200, 'ไร่กาแฟในหุบเขาที่มีอากาศเย็นตลอดปี', '2026-01-28 10:28:19', '2026-01-28 10:28:19'),
(44, 13, 'สวนกาแฟด่านซ้าย Highland', '89', 'บ้านนาแห้ว', 'นาแห้ว', 'ด่านซ้าย', '42120', 28.50, 17.26543200, 101.12345600, 'สวนกาแฟบนพื้นที่สูงระดับ 1,000 เมตร', '2026-01-28 10:28:19', '2026-01-28 10:28:19'),
(45, 14, 'ไร่กาแฟวังสะพุง River Side', '101', 'บ้านผาขาม', 'วังสะพุง', 'วังสะพุง', '42130', 22.00, 17.29876500, 101.98765400, 'ไร่กาแฟริมแม่น้ำปลูกแบบขั้นบันได', '2026-01-28 10:28:19', '2026-01-28 10:28:19');

-- --------------------------------------------------------

--
-- Table structure for table `coffee_type`
--

CREATE TABLE `coffee_type` (
  `coffee_id` int(11) NOT NULL,
  `farm_id` int(11) NOT NULL,
  `coffee_name` varchar(100) NOT NULL,
  `process_type` varchar(100) DEFAULT NULL,
  `harvest_season` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cultivation_method`
--

CREATE TABLE `cultivation_method` (
  `method_id` int(11) NOT NULL,
  `farm_id` int(11) NOT NULL,
  `coffee_id` int(11) NOT NULL,
  `planting_method` varchar(100) DEFAULT NULL,
  `soil_type` varchar(100) DEFAULT NULL,
  `water_system` varchar(100) DEFAULT NULL,
  `fertilizer_type` varchar(100) DEFAULT NULL,
  `maintenance` text DEFAULT NULL,
  `harvest_period` varchar(100) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `farm_owner`
--

CREATE TABLE `farm_owner` (
  `owner_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `farm_owner`
--

INSERT INTO `farm_owner` (`owner_id`, `username`, `password`, `fullname`, `email`, `phone`, `address`, `status`, `created_at`, `updated_at`) VALUES
(1, 'owner01', '$2a$10$ABCDEFGHIJKLMNOPQRSTUVabcdefghijklmnopqrstuvwxyz012345', 'นายสมชาย ใจดี', 'owner01@email.com', '0812345678', 'อำเภอเมือง จังหวัดเลย', 'approved', '2026-01-28 10:05:54', '2026-01-28 10:05:54'),
(2, 'owner02', '$2a$10$ABCDEFGHIJKLMNOPQRSTUVabcdefghijklmnopqrstuvwxyz012345', 'นางสาวสมพร รักษ์ป่า', 'owner02@email.com', '0898765432', 'อำเภอภูเรือ จังหวัดเลย', 'pending', '2026-01-28 10:05:54', '2026-01-28 10:05:54'),
(12, 'owner03', '$2a$10$ABCDEFGHIJKLMNOPQRSTUVabcdefghijklmnopqrstuvwxyz012345', 'นายวิทวัส ภูผา', 'owner03@email.com', '0823456789', 'อำเภอเชียงคาน จังหวัดเลย', 'approved', '2026-01-28 10:20:43', '2026-01-28 10:20:43'),
(13, 'owner04', '$2a$10$ABCDEFGHIJKLMNOPQRSTUVabcdefghijklmnopqrstuvwxyz012345', 'นางวรรณา ดอยสูง', 'owner04@email.com', '0834567890', 'อำเภอด่านซ้าย จังหวัดเลย', 'approved', '2026-01-28 10:20:43', '2026-01-28 10:20:43'),
(14, 'owner05', '$2a$10$ABCDEFGHIJKLMNOPQRSTUVabcdefghijklmnopqrstuvwxyz012345', 'นายภูริภัทร แดนอุดม', 'owner05@email.com', '0845678901', 'อำเภอวังสะพุง จังหวัดเลย', 'pending', '2026-01-28 10:20:43', '2026-01-28 10:20:43');

-- --------------------------------------------------------

--
-- Table structure for table `general_user`
--

CREATE TABLE `general_user` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `general_user`
--

INSERT INTO `general_user` (`user_id`, `username`, `password`, `email`, `created_at`, `updated_at`) VALUES
(1, 'user01', '$2a$10$ABCDEFGHIJKLMNOPQRSTUVabcdefghijklmnopqrstuvwxyz012345', 'user01@email.com', '2026-01-28 10:05:54', '2026-01-28 10:05:54'),
(2, 'user02', '$2a$10$ABCDEFGHIJKLMNOPQRSTUVabcdefghijklmnopqrstuvwxyz012345', 'user02@email.com', '2026-01-28 10:05:54', '2026-01-28 10:05:54');

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `media_id` int(11) NOT NULL,
  `ref_type` enum('farm','coffee') NOT NULL,
  `ref_id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`media_id`, `ref_type`, `ref_id`, `file_path`, `file_type`, `created_at`) VALUES
(1, 'farm', 1, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop', 'image/jpeg', '2026-01-28 10:35:15'),
(2, 'farm', 2, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop', 'image/jpeg', '2026-01-28 10:35:15'),
(3, 'farm', 3, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop', 'image/jpeg', '2026-01-28 10:35:15'),
(4, 'farm', 4, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop', 'image/jpeg', '2026-01-28 10:35:15'),
(5, 'coffee', 1, 'https://images.unsplash.com/photo-1587734195657-d5d462384c3a?w=800&auto=format&fit=crop', 'image/jpeg', '2026-01-28 10:35:15'),
(6, 'coffee', 3, 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&auto=format&fit=crop', 'image/jpeg', '2026-01-28 10:35:15');

-- --------------------------------------------------------

--
-- Table structure for table `production`
--

CREATE TABLE `production` (
  `production_id` int(11) NOT NULL,
  `coffee_id` int(11) NOT NULL,
  `harvest_year` year(4) DEFAULT NULL,
  `quantity_kg` decimal(10,2) DEFAULT NULL,
  `quality_grade` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `coffee_farm`
--
ALTER TABLE `coffee_farm`
  ADD PRIMARY KEY (`farm_id`),
  ADD KEY `owner_id` (`owner_id`);

--
-- Indexes for table `coffee_type`
--
ALTER TABLE `coffee_type`
  ADD PRIMARY KEY (`coffee_id`),
  ADD KEY `farm_id` (`farm_id`);

--
-- Indexes for table `cultivation_method`
--
ALTER TABLE `cultivation_method`
  ADD PRIMARY KEY (`method_id`),
  ADD KEY `farm_id` (`farm_id`),
  ADD KEY `coffee_id` (`coffee_id`);

--
-- Indexes for table `farm_owner`
--
ALTER TABLE `farm_owner`
  ADD PRIMARY KEY (`owner_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `general_user`
--
ALTER TABLE `general_user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`media_id`);

--
-- Indexes for table `production`
--
ALTER TABLE `production`
  ADD PRIMARY KEY (`production_id`),
  ADD KEY `coffee_id` (`coffee_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `coffee_farm`
--
ALTER TABLE `coffee_farm`
  MODIFY `farm_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `coffee_type`
--
ALTER TABLE `coffee_type`
  MODIFY `coffee_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cultivation_method`
--
ALTER TABLE `cultivation_method`
  MODIFY `method_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `farm_owner`
--
ALTER TABLE `farm_owner`
  MODIFY `owner_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `general_user`
--
ALTER TABLE `general_user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `media_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `production`
--
ALTER TABLE `production`
  MODIFY `production_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `coffee_farm`
--
ALTER TABLE `coffee_farm`
  ADD CONSTRAINT `coffee_farm_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `farm_owner` (`owner_id`);

--
-- Constraints for table `coffee_type`
--
ALTER TABLE `coffee_type`
  ADD CONSTRAINT `coffee_type_ibfk_1` FOREIGN KEY (`farm_id`) REFERENCES `coffee_farm` (`farm_id`);

--
-- Constraints for table `cultivation_method`
--
ALTER TABLE `cultivation_method`
  ADD CONSTRAINT `cultivation_method_ibfk_1` FOREIGN KEY (`farm_id`) REFERENCES `coffee_farm` (`farm_id`),
  ADD CONSTRAINT `cultivation_method_ibfk_2` FOREIGN KEY (`coffee_id`) REFERENCES `coffee_type` (`coffee_id`);

--
-- Constraints for table `production`
--
ALTER TABLE `production`
  ADD CONSTRAINT `production_ibfk_1` FOREIGN KEY (`coffee_id`) REFERENCES `coffee_type` (`coffee_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
