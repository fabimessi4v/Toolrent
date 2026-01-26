-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: toolrentdb
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `rut` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `status` tinytext NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rut` (`rut`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES ('0647142a-f745-4c22-a2c3-0f6def07d4de','gdfdg','dfgdf','fddfg','fabimessi4@gmail.com','Activo','2025-09-21 18:50:37'),('35c896d3-877e-4784-b74e-beb687e1f1fb','Eusebio Rojas','11.053.588-0','978757056','eusebio@gmail.com','Activo','2025-09-10 22:26:54'),('4b94e85d-6b2e-434e-b542-21e906b5549e','Carlos Iturra','111111111','978757099','carlositurra@gmail.com','Activo','2025-09-21 18:44:06'),('5312eb33-81f8-11f0-8b09-00155d4a2cda','Juan Pérez','12.345.678-9','987654321','juanperez@mail.com','ACTIVE','2025-08-25 21:13:19'),('5312f00e-81f8-11f0-8b09-00155d4a2cda','María González','9.876.543-2','912345678','maria.gonzalez@mail.com','RESTRICTED','2025-08-25 21:13:19'),('5312f23b-81f8-11f0-8b09-00155d4a2cda','Carlos Ruiz','11.223.344-5','934567812','carlos.ruiz@mail.com','RESTRICTED','2025-08-25 21:13:19'),('66faf970-1bc5-4186-afd3-1d8b963bac2a','Juan Ignacio Pérez','46456','(9) 7875 7036','fabi@fabi.com','Activo','2025-09-21 22:02:34'),('7bc126f3-62e1-4a39-b682-b151b3ffc31a','dfsgdfsg','sdfgds','dsfg','dsfg@dfgs.ff','Activo','2025-09-21 18:48:53'),('8b8310af-fff5-47c6-b546-69a72d1d2a62','Nuevo Cliente','12.222.333-4','+56 9 5555 5555','nuevo@email.com','Activo','2025-09-09 22:04:23');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee`
--

DROP TABLE IF EXISTS `fee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fee` (
  `id` varchar(36) NOT NULL,
  `type` tinytext NOT NULL,
  `value` float NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee`
--

LOCK TABLES `fee` WRITE;
/*!40000 ALTER TABLE `fee` DISABLE KEYS */;
INSERT INTO `fee` VALUES ('89a8eddf-77de-4575-94f6-f7dc38be44de','LATE_FEE',5400,'2025-09-13 17:39:18',NULL);
/*!40000 ALTER TABLE `fee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kardex`
--

DROP TABLE IF EXISTS `kardex`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kardex` (
  `id` varchar(36) NOT NULL,
  `tool_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `loans_id` varchar(36) DEFAULT NULL,
  `type` tinytext NOT NULL,
  `quantity` int NOT NULL,
  `movement_date` date NOT NULL,
  `comments` text,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `loans_id` (`loans_id`),
  KEY `kardex_ibfk_1` (`tool_id`),
  CONSTRAINT `kardex_ibfk_1` FOREIGN KEY (`tool_id`) REFERENCES `tools` (`id`) ON DELETE CASCADE,
  CONSTRAINT `kardex_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `kardex_ibfk_3` FOREIGN KEY (`loans_id`) REFERENCES `loans` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kardex`
--

LOCK TABLES `kardex` WRITE;
/*!40000 ALTER TABLE `kardex` DISABLE KEYS */;
INSERT INTO `kardex` VALUES ('0ea31e63-7e97-495c-adad-eb4de527a64e','53139286-81f8-11f0-8b09-00155d4a2cda','5310f2ee-81f8-11f0-8b09-00155d4a2cda','e98cc4ff-b362-488a-ac87-6e325540f42a','LOAN',1,'2025-09-23',NULL,'2025-09-23 23:36:48'),('47493753-a57f-4afc-81f0-a75275cf7fc8','80cdd6bf-a068-46d4-ab12-836bb21eb20d','5310f2ee-81f8-11f0-8b09-00155d4a2cda','d5f40020-155e-4199-bc1b-bd66eff79b39','LOAN',1,'2025-09-23',NULL,'2025-09-23 23:36:33'),('d2df5f48-d551-48e0-9581-57524fbd7db5','5313917c-81f8-11f0-8b09-00155d4a2cda','5310f2ee-81f8-11f0-8b09-00155d4a2cda','3677490e-0867-457e-9f0b-b573500c7c06','LOAN',1,'2025-09-23',NULL,'2025-09-23 23:35:50'),('f20ddbd7-11a4-44cf-884b-aeaee705be4b','e6e12e9d-72f6-4a52-85e9-facb31365ea6','5310f2ee-81f8-11f0-8b09-00155d4a2cda','f908e498-8ac7-40e7-a9e5-8f1f079c5e3a','LOAN',1,'2025-09-23',NULL,'2025-09-23 23:37:03'),('fc57911c-0db4-4592-b7a7-cba31736d68e','53139310-81f8-11f0-8b09-00155d4a2cda','5310f2ee-81f8-11f0-8b09-00155d4a2cda','0ec71626-dc78-4a86-afe8-5aeeb891a29d','LOAN',1,'2025-09-23',NULL,'2025-09-23 23:36:14');
/*!40000 ALTER TABLE `kardex` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loans`
--

DROP TABLE IF EXISTS `loans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loans` (
  `id` varchar(36) NOT NULL,
  `client_id` varchar(36) NOT NULL,
  `tool_id` varchar(36) NOT NULL,
  `customers_id` varchar(36) NOT NULL,
  `delivery_date` date NOT NULL,
  `due_date` date NOT NULL,
  `return_date` date DEFAULT NULL,
  `status` tinytext NOT NULL,
  `fine` float DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`),
  KEY `customers_id` (`customers_id`),
  KEY `loans_ibfk_2` (`tool_id`),
  CONSTRAINT `loans_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`),
  CONSTRAINT `loans_ibfk_2` FOREIGN KEY (`tool_id`) REFERENCES `tools` (`id`) ON DELETE CASCADE,
  CONSTRAINT `loans_ibfk_3` FOREIGN KEY (`customers_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loans`
--

LOCK TABLES `loans` WRITE;
/*!40000 ALTER TABLE `loans` DISABLE KEYS */;
INSERT INTO `loans` VALUES ('0ec71626-dc78-4a86-afe8-5aeeb891a29d','5310f2ee-81f8-11f0-8b09-00155d4a2cda','53139310-81f8-11f0-8b09-00155d4a2cda','4b94e85d-6b2e-434e-b542-21e906b5549e','2025-09-24','2025-10-30',NULL,'ACTIVE',0,NULL),('3677490e-0867-457e-9f0b-b573500c7c06','5310f2ee-81f8-11f0-8b09-00155d4a2cda','5313917c-81f8-11f0-8b09-00155d4a2cda','4b94e85d-6b2e-434e-b542-21e906b5549e','2025-09-24','2025-10-14',NULL,'ACTIVE',0,NULL),('ba6cd25c-2dc2-475e-8994-d8f21c966e67','5310f2ee-81f8-11f0-8b09-00155d4a2cda','53138df7-81f8-11f0-8b09-00155d4a2cda','0647142a-f745-4c22-a2c3-0f6def07d4de','2025-12-20','2025-12-30','2025-12-30','RETURNED',0,'2025-12-20 16:24:20'),('d5f40020-155e-4199-bc1b-bd66eff79b39','5310f2ee-81f8-11f0-8b09-00155d4a2cda','80cdd6bf-a068-46d4-ab12-836bb21eb20d','4b94e85d-6b2e-434e-b542-21e906b5549e','2025-09-24','2025-10-03',NULL,'ACTIVE',0,NULL),('e98cc4ff-b362-488a-ac87-6e325540f42a','5310f2ee-81f8-11f0-8b09-00155d4a2cda','53139286-81f8-11f0-8b09-00155d4a2cda','4b94e85d-6b2e-434e-b542-21e906b5549e','2025-09-23','2025-09-29',NULL,'ACTIVE',0,NULL),('f908e498-8ac7-40e7-a9e5-8f1f079c5e3a','5310f2ee-81f8-11f0-8b09-00155d4a2cda','e6e12e9d-72f6-4a52-85e9-facb31365ea6','4b94e85d-6b2e-434e-b542-21e906b5549e','2025-09-24','2025-09-29',NULL,'ACTIVE',0,NULL);
/*!40000 ALTER TABLE `loans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tools`
--

DROP TABLE IF EXISTS `tools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tools` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `status` tinytext NOT NULL,
  `replacement_value` float NOT NULL,
  `rental_price` float NOT NULL,
  `stock` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tool_image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tools`
--

LOCK TABLES `tools` WRITE;
/*!40000 ALTER TABLE `tools` DISABLE KEYS */;
INSERT INTO `tools` VALUES ('0f4768e1-df54-4aa3-84c2-ac580dd4c2dd','martillo de oro','Manual','Disponible',5000000,5000,2,'2025-09-05 21:05:38','https://storage.googleapis.com/toolrent-bucket/martillo_de_oro.jpg'),('53138df7-81f8-11f0-8b09-00155d4a2cda','Taladro Bosch','Electric','AVAILABLE',120000,5000,5,'2025-08-25 21:13:19',NULL),('5313917c-81f8-11f0-8b09-00155d4a2cda','Martillo','Manual','AVAILABLE',15000,1000,21,'2025-08-25 21:13:19',NULL),('53139286-81f8-11f0-8b09-00155d4a2cda','Sierra Circular','Electric','UNDER_REPAIR',90000,4000,2,'2025-08-25 21:13:19',NULL),('53139310-81f8-11f0-8b09-00155d4a2cda','Escalera 3m','Manual','AVAILABLE',45000,2000,12,'2025-08-25 21:13:19',NULL),('80cdd6bf-a068-46d4-ab12-836bb21eb20d','casco AZUL','Equipo de Seguridad','Disponible',50000,500,5,'2025-09-08 23:43:49',NULL),('83f6deb0-5445-4509-a38b-bd73afa79b8a','rotomartillo','Electrica','Disponible',150000,15000,4,'2025-09-13 18:03:02',NULL),('e6e12e9d-72f6-4a52-85e9-facb31365ea6','Taladro de pecho manual','Manual','Disponible',600000,20000,9,'2025-09-07 19:16:05',NULL);
/*!40000 ALTER TABLE `tools` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-02 15:47:23
