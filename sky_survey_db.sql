-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 08, 2023 at 12:28 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sky_survey_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `FileProperties`
--

CREATE TABLE `FileProperties` (
  `id` int(11) NOT NULL,
  `format` varchar(191) NOT NULL,
  `max_file_size` double NOT NULL,
  `max_file_size_unit` varchar(191) NOT NULL,
  `multiple` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `FileProperties`
--

INSERT INTO `FileProperties` (`id`, `format`, `max_file_size`, `max_file_size_unit`, `multiple`) VALUES
(1, '.pdf', 1, 'mb', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Question`
--

CREATE TABLE `Question` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `required` tinyint(1) NOT NULL,
  `text` varchar(191) DEFAULT NULL,
  `description` varchar(191) DEFAULT NULL,
  `frm_options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`frm_options`)),
  `filePropertiesId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Question`
--

INSERT INTO `Question` (`id`, `name`, `type`, `required`, `text`, `description`, `frm_options`, `filePropertiesId`) VALUES
(1, 'full_name', 'short_text', 1, 'What is your full name?', '[Surname] [First Name] [Other Names]', NULL, NULL),
(2, 'email_address', 'email', 1, 'What is your email address?', '', NULL, NULL),
(3, 'description', 'long_text', 1, 'Tell us a bit more about yourself', NULL, NULL, NULL),
(4, 'gender', 'choice', 1, 'What is your gender?', NULL, '{\"multiple\":\"no\",\"values\":[\"Male\",\"Female\",\"Other\"]}', NULL),
(5, 'programming_stack', 'choice', 1, 'What is your gender?', 'You can select multiple', '{\"multiple\":\"yes\",\"values\":[\"React\",\"Angular\",\"VUE\",\"SQL\",\"POSTGRES\",\"MYSQL\",\"MSSQL\",\"Java\",\"PHP\",\"GO\",\"RUST\"]}', NULL),
(6, 'certificates', 'file', 1, 'Upload any of your certificates?', 'You can upload multiple (.pdf)', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Response`
--

CREATE TABLE `Response` (
  `id` int(11) NOT NULL,
  `date_responded` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`response`)),
  `sessionId` varchar(191) NOT NULL,
  `question` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('14537fd9-460a-4d43-af09-75d47ae30be1', 'ea25e6a6e586ef1deb7ce0d1b5d82cbbb75b344d3605b2f2b7aa48d629eb065c', '2023-11-01 22:47:17.096', '20231030190410_init', NULL, NULL, '2023-11-01 22:47:17.083', 1),
('5431109b-bfd7-411e-91c1-4b94768d3d2d', 'e40cb4d36f88d5f053fc34e3180ddc202dc95a89a6487f48d08192c1974a8ba5', '2023-11-02 13:29:16.097', '20231102132916_init', NULL, NULL, '2023-11-02 13:29:16.067', 1),
('5cbab641-d748-4997-9372-f35727b78fda', 'ad29db1bb67db6e30886fcfd61eee61ea900e4d293b189d2562ef91d2fa96c5e', '2023-11-02 13:35:57.946', '20231102133557_init', NULL, NULL, '2023-11-02 13:35:57.912', 1),
('94853f3e-e313-41e5-819f-8f9ecf1c9bb5', '3b33925c993837322fdf65995706f5cac05a9b8fbe124f8018bba4b17def54e5', '2023-11-03 20:42:26.386', '20231103204226_init', NULL, NULL, '2023-11-03 20:42:26.351', 1),
('c3555b9e-4c8e-441c-a18e-b8490380a870', 'b158606ba29491da15c6f5c28c566aa8ac235a48f154627ccafae2ce888938d5', '2023-11-01 22:47:17.165', '20231030201317_init', NULL, NULL, '2023-11-01 22:47:17.097', 1),
('d4ce2eea-dbcd-439e-8e10-8910d79e77fc', '0063c4fe1973a8ddc5001c941ec16e46a292e8860d89d05ad2693b0e0f597ec4', '2023-11-01 22:47:17.581', '20231101224717_init', NULL, NULL, '2023-11-01 22:47:17.556', 1),
('e93b756f-481e-457a-8340-4e7757014f23', '3f907633af4fed28e575965f61c05686c80195a8a2378f23e95aca97f970eef5', '2023-11-02 13:32:59.309', '20231102133259_init', NULL, NULL, '2023-11-02 13:32:59.268', 1),
('f1b98174-f247-48c3-8801-307a3337ebbf', '88ce110f2f6040bd70225921d75ee7168afc887d0db0f57912322e79b67c20ff', '2023-11-02 13:21:46.345', '20231102132146_init', NULL, NULL, '2023-11-02 13:21:46.259', 1),
('f26ddba9-97d2-4985-8ef8-87205c0fe982', '1fb8bb30ba69ec43cf0ca121da8b1b51c33cc7c89450b0779fe558f598a51388', '2023-11-01 22:47:17.081', '20231030174638_init', NULL, NULL, '2023-11-01 22:47:16.957', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `FileProperties`
--
ALTER TABLE `FileProperties`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Question`
--
ALTER TABLE `Question`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Question_filePropertiesId_fkey` (`filePropertiesId`);

--
-- Indexes for table `Response`
--
ALTER TABLE `Response`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `FileProperties`
--
ALTER TABLE `FileProperties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Question`
--
ALTER TABLE `Question`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Response`
--
ALTER TABLE `Response`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Question`
--
ALTER TABLE `Question`
  ADD CONSTRAINT `Question_filePropertiesId_fkey` FOREIGN KEY (`filePropertiesId`) REFERENCES `FileProperties` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
