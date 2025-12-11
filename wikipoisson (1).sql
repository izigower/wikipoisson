-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 11 déc. 2025 à 23:33
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `wikipoisson`
--

-- --------------------------------------------------------

--
-- Structure de la table `commentaire`
--

CREATE TABLE `commentaire` (
  `id_commentaire` int(11) NOT NULL,
  `note` tinyint(4) DEFAULT NULL,
  `commentaire` text DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `validation` tinyint(1) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `id_espece` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `contribution`
--

CREATE TABLE `contribution` (
  `id_contribution` int(11) NOT NULL,
  `date_creation` datetime DEFAULT NULL,
  `validation` tinyint(1) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `id_espece` bigint(20) DEFAULT 0,
  `nom_commun` varchar(50) DEFAULT NULL,
  `nom_scientifique` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `taille_max` decimal(15,2) DEFAULT NULL,
  `alimentation` varchar(50) DEFAULT NULL,
  `temperature` decimal(15,2) DEFAULT NULL,
  `dificulte` varchar(50) DEFAULT NULL,
  `cree_le` datetime DEFAULT NULL,
  `id_temperament` int(11) DEFAULT 0,
  `id_famille` int(11) DEFAULT 0,
  `id_habitat` int(11) DEFAULT 0,
  `image_1` varchar(250) DEFAULT NULL,
  `image_2` varchar(250) DEFAULT NULL,
  `image_3` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `contribution`
--

INSERT INTO `contribution` (`id_contribution`, `date_creation`, `validation`, `user_id`, `id_espece`, `nom_commun`, `nom_scientifique`, `description`, `taille_max`, `alimentation`, `temperature`, `dificulte`, `cree_le`, `id_temperament`, `id_famille`, `id_habitat`, `image_1`, `image_2`, `image_3`) VALUES
(1, '2025-06-03 21:36:02', 1, 2, 3, 'Tetraodon lineatus', 'Tetraodon lineatus', 'Poisson-globe d’eau douce africain, réputé pour son agressivité et son intelligence.', 45.00, 'Carnivore (crustacés, escargots, mollusques)', 27.00, 'Confirme', '2025-06-03 21:36:02', 5, 4, 6, NULL, NULL, NULL),
(2, '2025-06-03 21:53:13', 0, 2, 4, 'pleco commun', 'Hypostomus plecostomus', 'Poisson nettoyeur nocturne avec une bouche ventouse.', 55.00, 'Herbivore (algues, végétaux)', 25.00, 'Debutant', '2025-06-03 21:53:13', 10, 7, 10, NULL, NULL, NULL),
(3, '2025-06-04 16:28:07', 1, 5, 3, 'Tetraodon lineatus', 'Tetraodon lineatus', 'Poisson-globe d’eau douce africain, réputé pour son agressivité et son intelligence.', 45.00, 'Carnivore (crustacés, escargots, mollusques)', 26.00, 'Confirme', '2025-06-04 16:28:07', 5, 4, 6, NULL, NULL, NULL),
(4, '2025-06-05 13:09:21', 1, 2, 8, 'poisson arché', 'Toxotes jaculatrix', 'Poisson capable de projeter de l’eau pour chasser les insectes hors de l’eau.', 27.00, 'Carnivore (insectes, larves, petits poissons)', 27.00, 'Confirme', '2025-06-05 13:09:21', 7, 6, 8, NULL, NULL, NULL),
(5, '2025-06-07 22:02:57', 1, 2, 3, 'Tetraodon lineatus', 'Tetraodon lineatus', 'Poisson-globe d’eau douce africain, réputé pour son agressivité et son intelligence.', 45.00, 'Carnivore (crustacés, escargots, mollusques)', 27.00, 'Confirme', '2025-06-07 22:02:57', 5, 4, 6, NULL, NULL, NULL),
(6, '2025-06-09 01:06:08', 1, 2, 4, 'pleco commun', 'Hypostomus plecostomus', 'Poisson nettoyeur nocturne avec une bouche ventouse.', 55.00, 'Herbivore (algues, végétaux)', 25.00, 'Debutant', '2025-06-09 01:06:08', 10, 7, 10, NULL, NULL, NULL),
(7, '2025-12-11 12:13:57', -1, 9, 5, 'oréochromis esculentus', 'oréochromis esculentus', 'Tilapia endémique du lac Victoria, très menacé.\n[Tempérament proposé] Grégaire, pacifique', 40.00, 'Herbivore (phytoplancton, algues)', 26.50, 'Debutant', '2025-12-11 12:13:57', 4, 3, 5, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748899493/fish_species/aueqzcrypugm8g7nzys1.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748899497/fish_species/ouckdicoygpvjfnltsau.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748899499/fish_species/tuakb0m6bcubsqdqv0ys.jpg'),
(8, '2025-12-11 12:14:08', -1, 9, 5, 'oréochromis esculentus', 'oréochromis esculentus', 'Tilapia endémique du lac Victoria, très menacé.\n[Tempérament proposé] Grégaire, pacifique, calme ', 40.00, 'Herbivore (phytoplancton, algues)', 26.00, 'Debutant', '2025-12-11 12:14:08', 4, 3, 5, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748899493/fish_species/aueqzcrypugm8g7nzys1.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748899497/fish_species/ouckdicoygpvjfnltsau.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748899499/fish_species/tuakb0m6bcubsqdqv0ys.jpg'),
(9, '2025-12-11 12:21:22', 1, 9, 2, 'arowana argenté', 'Osteoglossum bicirrhosum', 'Poisson prédateur d\'Amérique du Sud, célèbre pour ses sauts hors de l\'eau.\n[Tempérament proposé] Solitaire, territorial', 91.00, 'Carnivore (poissons, insectes, crustacés)', 25.00, 'Confirme', '2025-12-11 12:21:22', 1, 1, 2, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898689/fish_species/tdaqwzylbculru2it3pb.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898690/fish_species/nlxs4gcg6pkrjlkmfbl5.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898693/fish_species/tgws9rdgrfrjtmpdgktd.jpg'),
(10, '2025-12-11 12:28:24', 1, 10, 2, 'arowana argenté', 'Osteoglossum bicirrhosum', 'Poisson prédateur d\'Amérique du Sud, célèbre pour ses sauts hors de l\'eau.\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial', 90.00, 'Carnivore (poissons, insectes, crustacés)', 25.00, 'Confirme', '2025-12-11 12:28:24', 1, 1, 2, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898689/fish_species/tdaqwzylbculru2it3pb.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898690/fish_species/nlxs4gcg6pkrjlkmfbl5.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898693/fish_species/tgws9rdgrfrjtmpdgktd.jpg'),
(11, '2025-12-11 12:34:08', 1, 9, 2, 'arowana argenté', 'Osteoglossum bicirrhosum', 'Poisson prédateur d\'Amérique du Sud, célèbre pour ses sauts hors de l\'eau.\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial', 91.00, 'Carnivore (poissons, insectes, crustacés)', 25.00, 'Confirme', '2025-12-11 12:34:08', 1, 1, 2, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898689/fish_species/tdaqwzylbculru2it3pb.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898690/fish_species/nlxs4gcg6pkrjlkmfbl5.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898693/fish_species/tgws9rdgrfrjtmpdgktd.jpg'),
(12, '2025-12-11 13:50:25', 1, 9, 2, 'arowana argenté', 'Osteoglossum bicirrhosum', 'Poisson prédateur d\'Amérique du Sud, célèbre pour ses sauts hors de l\'eau.\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial', 90.00, 'Carnivore (poissons, insectes, crustacés)', 25.00, 'Confirme', '2025-12-11 13:50:25', 1, 1, 2, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898689/fish_species/tdaqwzylbculru2it3pb.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898690/fish_species/nlxs4gcg6pkrjlkmfbl5.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898693/fish_species/tgws9rdgrfrjtmpdgktd.jpg'),
(13, '2025-12-11 15:01:33', 1, 9, 2, 'arowana argenté', 'Osteoglossum bicirrhosum', 'Poisson prédateur d\'Amérique du Sud, célèbre pour ses sauts hors de l\'eau.\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial', 91.00, 'Carnivore (poissons, insectes, crustacés)', 25.00, 'Confirme', '2025-12-11 15:01:33', 1, 1, 2, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898689/fish_species/tdaqwzylbculru2it3pb.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898690/fish_species/nlxs4gcg6pkrjlkmfbl5.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898693/fish_species/tgws9rdgrfrjtmpdgktd.jpg'),
(14, '2025-12-11 15:01:47', 1, 9, 2, 'arowana argenté', 'Osteoglossum bicirrhosum', 'Poisson prédateur d\'Amérique du Sud, célèbre pour ses sauts hors de l\'eau.\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial', 90.00, 'Carnivore (poissons, insectes, crustacés)', 25.00, 'Confirme', '2025-12-11 15:01:47', 1, 1, 2, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898689/fish_species/tdaqwzylbculru2it3pb.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898690/fish_species/nlxs4gcg6pkrjlkmfbl5.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898693/fish_species/tgws9rdgrfrjtmpdgktd.jpg'),
(15, '2025-12-11 15:19:22', 1, 9, 2, 'arowana argenté', 'Osteoglossum bicirrhosum', 'Poisson prédateur d\'Amérique du Sud, célèbre pour ses sauts hors de l\'eau.\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial', 91.00, 'Carnivore (poissons, insectes, crustacés)', 25.00, 'Confirme', '2025-12-11 15:19:22', 1, 1, 2, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898689/fish_species/tdaqwzylbculru2it3pb.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898690/fish_species/nlxs4gcg6pkrjlkmfbl5.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898693/fish_species/tgws9rdgrfrjtmpdgktd.jpg'),
(16, '2025-12-11 15:19:38', 1, 9, 2, 'arowana argenté', 'Osteoglossum bicirrhosum', 'Poisson prédateur d\'Amérique du Sud, célèbre pour ses sauts hors de l\'eau.\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial\n[Tempérament proposé] Solitaire, territorial', 90.00, 'Carnivore (poissons, insectes, crustacés)', 25.00, 'Confirme', '2025-12-11 15:19:38', 1, 1, 2, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898689/fish_species/tdaqwzylbculru2it3pb.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898690/fish_species/nlxs4gcg6pkrjlkmfbl5.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898693/fish_species/tgws9rdgrfrjtmpdgktd.jpg'),
(17, '2025-12-11 15:38:55', 1, 9, 7, 'cichlidé malawi', 'Maylandia, Aulonocara, etc.', 'Poissons colorés originaires du lac Malawi, avec une forte territorialité.\n[Tempérament proposé] Territorial, en groupe hiérarchisé', 20.00, 'Omnivore (algues, invertébrés)', 25.00, 'Debutant', '2025-12-11 15:38:55', 8, 3, 9, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748900584/fish_species/euzfchxhofeveoawejcq.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748900586/fish_species/xs36qnrpeuti3gjosycc.jpg', NULL),
(18, '2025-12-11 15:52:02', 1, 9, 5, 'oréochromis esculentus', 'oréochromis esculentus', 'Tilapia endémique du lac Victoria, très menacé.\n[Tempérament proposé] Grégaire, pacifique', 30.00, 'Herbivore (phytoplancton, algues)', 26.00, 'Debutant', '2025-12-11 15:52:02', 4, 3, 5, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748899493/fish_species/aueqzcrypugm8g7nzys1.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748899497/fish_species/ouckdicoygpvjfnltsau.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748899499/fish_species/tuakb0m6bcubsqdqv0ys.jpg'),
(19, '2025-12-11 19:29:36', 1, 9, 5, 'oréochromis esculentus', 'oréochromis esculentus', 'Tilapia endémique du lac Victoria, très menacé.\n[Tempérament proposé] Grégaire, pacifique\n[Tempérament proposé] Grégaire, pacifique', 35.00, 'Herbivore (phytoplancton, algues)', 26.00, 'Debutant', '2025-12-11 19:29:36', 4, 3, 5, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748899493/fish_species/aueqzcrypugm8g7nzys1.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748899497/fish_species/ouckdicoygpvjfnltsau.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748899499/fish_species/tuakb0m6bcubsqdqv0ys.jpg'),
(20, '2025-12-11 21:52:43', -1, 9, 0, 'A', 'A', 'A\n\n[Famille] A\n\n[Habitat] A\n\n[Tempérament] A', 1.00, 'AA', 1.00, 'A', '2025-12-11 21:52:43', 0, 0, 0, NULL, NULL, NULL),
(23, '2025-12-11 23:31:07', 1, 9, 5, 'oréochromis esculentus', 'oréochromis esculentus', 'Tilapia endémique du lac Victoria, très menacé.\n', 35.00, 'Herbivore (phytoplancton, algues)', 26.00, 'Debutant', '2025-12-11 23:31:07', 4, 3, 5, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748899493/fish_species/aueqzcrypugm8g7nzys1.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748899497/fish_species/ouckdicoygpvjfnltsau.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748899499/fish_species/tuakb0m6bcubsqdqv0ys.jpg');

-- --------------------------------------------------------

--
-- Structure de la table `espece`
--

CREATE TABLE `espece` (
  `id_espece` int(11) NOT NULL,
  `nom_commun` varchar(50) DEFAULT NULL,
  `nom_scientifique` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `taille_max` decimal(15,2) DEFAULT NULL,
  `alimentation` varchar(50) DEFAULT NULL,
  `temperature` decimal(15,2) DEFAULT NULL,
  `dificulte` varchar(50) DEFAULT NULL,
  `cree_le` datetime DEFAULT NULL,
  `modifie_le` datetime DEFAULT NULL,
  `id_temperament` int(11) NOT NULL,
  `id_famille` int(11) NOT NULL,
  `id_habitat` int(11) NOT NULL,
  `id_contribution_valide` int(11) DEFAULT NULL,
  `image_1` varchar(250) NOT NULL,
  `image_2` varchar(250) DEFAULT NULL,
  `image_3` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `espece`
--

INSERT INTO `espece` (`id_espece`, `nom_commun`, `nom_scientifique`, `description`, `taille_max`, `alimentation`, `temperature`, `dificulte`, `cree_le`, `modifie_le`, `id_temperament`, `id_famille`, `id_habitat`, `id_contribution_valide`, `image_1`, `image_2`, `image_3`) VALUES
(2, 'arowana argenté', 'Osteoglossum bicirrhosum', 'Poisson prédateur d\'Amérique du Sud, célèbre pour ses sauts hors de l\'eau.\n', 90.00, 'Carnivore (poissons, insectes, crustacés)', 25.00, 'Confirme', NULL, '2025-12-11 23:18:21', 1, 1, 2, 16, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898689/fish_species/tdaqwzylbculru2it3pb.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898690/fish_species/nlxs4gcg6pkrjlkmfbl5.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748898693/fish_species/tgws9rdgrfrjtmpdgktd.jpg'),
(3, 'Tetraodon lineatus', 'Tetraodon lineatus', 'Poisson-globe d’eau douce africain, réputé pour son agressivité et son intelligence.', 45.00, 'Carnivore (crustacés, escargots, mollusques)', 27.00, 'Confirme', '2025-06-07 22:02:57', '2025-06-07 20:05:03', 5, 4, 6, 5, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748894921/fish_species/qylhfkjse1hfcug9z6ws.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748894757/fish_species/ncyujsrhkdf2kfthnjs6.jpg', ''),
(4, 'pleco commun', 'Hypostomus plecostomus', 'Poisson nettoyeur nocturne avec une bouche ventouse.', 55.00, 'Herbivore (algues, végétaux)', 25.00, 'Debutant', '2025-06-09 01:06:08', '2025-06-08 23:06:26', 10, 7, 10, 6, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748899415/fish_species/bkacvtyatnituczd9ixa.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748899419/fish_species/qbhx586keph9rbvtwkjg.jpg', ''),
(5, 'oréochromis esculentus', 'oréochromis esculentus', 'Tilapia endémique du lac Victoria, très menacé.\n', 35.00, 'Herbivore (phytoplancton, algues)', 26.00, 'Debutant', '2025-06-02 23:24:59', '2025-12-11 23:31:12', 4, 3, 5, 23, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748899493/fish_species/aueqzcrypugm8g7nzys1.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748899497/fish_species/ouckdicoygpvjfnltsau.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748899499/fish_species/tuakb0m6bcubsqdqv0ys.jpg'),
(6, 'oscar', 'Astronotus ocellatus', 'Cichlidé sud-américain intelligent et territorial.', 35.00, 'Omnivore à tendance carnivore', 25.00, 'Debutant', '2025-06-02 23:41:49', '2025-06-02 23:41:49', 3, 3, 4, NULL, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748900505/fish_species/hzgzjq6eailwevgyjv8o.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748900507/fish_species/okds6ehb5uoftelwxxcw.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748900509/fish_species/tzlib0uyr2dzcnmzgf1m.jpg'),
(7, 'cichlidé malawi', 'Maylandia, Aulonocara, etc.', 'Poissons colorés originaires du lac Malawi, avec une forte territorialité.\n', 20.00, 'Omnivore (algues, invertébrés)', 25.00, 'Debutant', '2025-06-02 23:43:06', '2025-12-11 23:31:32', 8, 3, 9, 17, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748900584/fish_species/euzfchxhofeveoawejcq.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748900586/fish_species/xs36qnrpeuti3gjosycc.jpg', NULL),
(8, 'poisson arché', 'Toxotes jaculatrix', 'Poisson capable de projeter de l’eau pour chasser les insectes hors de l’eau.', 27.00, 'Carnivore (insectes, larves, petits poissons)', 27.00, 'Confirme', '2025-06-05 13:09:21', '2025-06-05 11:09:42', 7, 6, 8, 4, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748900665/fish_species/avaw1inzyvkbfhh8vlq0.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748900667/fish_species/jvmlcvhvac0wekzeccbb.jpg', ''),
(9, 'silure grenouille', 'Clarias batrachus', 'Poisson-chat pouvant respirer l’air et se déplacer hors de l’eau.', 50.00, 'Carnivore opportuniste', 26.00, 'Debutant', '2025-06-02 23:45:33', '2025-06-02 23:45:33', 10, 8, 11, NULL, 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748900731/fish_species/i0wqhc9wtk2sjgnpqdie.jpg', 'https://res.cloudinary.com/dfmbhkfao/image/upload/v1748900733/fish_species/x3csoh1er7s2b6pxrnbz.jpg', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `famille`
--

CREATE TABLE `famille` (
  `id_famille` int(11) NOT NULL,
  `libelle` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `famille`
--

INSERT INTO `famille` (`id_famille`, `libelle`, `description`) VALUES
(1, 'Osteoglossidae', 'Famille de poissons primitifs appelés poissons osse-langue.'),
(2, 'Polypteridae', 'Famille de poissons osseux primitifs d’Afrique.'),
(3, 'Cichlidae', 'Famille très diversifiée de poissons d’eau douce.'),
(4, 'Tetraodontidae', 'Famille des poissons-globes, souvent toxiques et dotés de dents puissantes.'),
(5, 'Mochokidae', 'Famille de poissons-chats africains souvent adaptés à la vie en aquarium.'),
(6, 'Toxotidae', 'Famille de poissons chasseurs en surface, capable de tirer un jet d\'eau.'),
(7, 'Loricariidae', 'Famille des poissons-chats cuirassés sud-américains.'),
(8, 'Clariidae', 'Famille de poissons-chats à respiration aérienne.'),
(9, 'Claroteidae', 'Famille de gros poissons-chats africains.');

-- --------------------------------------------------------

--
-- Structure de la table `habitat`
--

CREATE TABLE `habitat` (
  `id_habitat` int(11) NOT NULL,
  `libelle` varchar(50) DEFAULT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `habitat`
--

INSERT INTO `habitat` (`id_habitat`, `libelle`, `description`) VALUES
(1, 'Eaux stagnantes africaines', 'Marais, lacs et rivières peu profondes.'),
(2, 'Rivière amazonienne', 'Eaux lentes, riches en végétation et peu profondes.'),
(4, 'Amazonie', 'Rivières lentes, zones boisées inondées.'),
(5, 'Lac Victoria', 'Eaux douces tropicales peu profondes.'),
(6, 'Fleuves africains', 'Eaux calmes et chaudes d’Afrique de l’Ouest.'),
(7, 'Rivières et lacs africains', 'Eaux douces tropicales avec fond vaseux.'),
(8, 'Mangroves et estuaires', 'Eaux saumâtres entre mer et rivière.'),
(9, 'Lac Malawi', 'Eaux claires et rocheuses du lac africain.'),
(10, 'Rivières sud-américaines', 'Eaux chaudes avec fond pierreux ou sablonneux.'),
(11, 'Rizières, marais et canaux', 'Eaux stagnantes tropicales pauvres en oxygène.');

-- --------------------------------------------------------

--
-- Structure de la table `historique`
--

CREATE TABLE `historique` (
  `id_historique` int(11) NOT NULL,
  `recherche` varchar(100) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `historique`
--

INSERT INTO `historique` (`id_historique`, `recherche`, `date`, `user_id`) VALUES
(1, 'poisson arché', '2025-06-03 21:49:04', 2),
(2, 'Tetraodon lineatus', '2025-06-03 21:49:17', 2),
(3, 'pleco', '2025-06-03 21:49:24', 2),
(4, 'poisson arché', '2025-06-05 02:08:40', 3),
(5, 'Tetraodon lineatus', '2025-06-05 02:08:45', 3),
(6, 'arowana argenté', '2025-06-05 02:08:51', 3),
(7, 'oréochromis esculentus', '2025-06-05 02:08:57', 3),
(8, 'arowa', '2025-06-05 13:06:24', 2);

-- --------------------------------------------------------

--
-- Structure de la table `temperament`
--

CREATE TABLE `temperament` (
  `id_temperament` int(11) NOT NULL,
  `libelle` varchar(50) DEFAULT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `temperament`
--

INSERT INTO `temperament` (`id_temperament`, `libelle`, `description`) VALUES
(1, 'Solitaire, territorial', 'Défend activement son espace, peut devenir agressif avec les intrus.'),
(2, 'Solitaire, calme', 'Préfère vivre seul, interactions limitées avec les congénères.'),
(3, 'Territorial, agressif en période de reproduction', 'Peut attaquer ou intimider d\'autres poissons, cohabitation difficile.'),
(4, 'Grégaire, pacifique', 'Comportement calme, cohabitation facile avec d\'autres espèces paisibles.'),
(5, 'Solitaire, très territorial', 'Défend activement son espace, peut devenir agressif avec les intrus.'),
(6, 'Pacifique, grégaire', 'Préfère vivre en groupe ou banc, comportement social important.'),
(7, 'Pacifique', 'Comportement calme, cohabitation facile avec d\'autres espèces paisibles.'),
(8, 'Territorial, en groupe hiérarchisé', 'Défend son espace mais vit en groupe structuré.'),
(9, 'Pacifique, solitaire', 'Comportement calme mais préfère rester isolé.'),
(10, 'Solitaire, nocturne', 'Actif la nuit, vit seul.'),
(11, 'Pacifique mais nécessite de l’espace', 'Calme mais a besoin d’un très grand espace.');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `pseudo` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mdp` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`user_id`, `pseudo`, `email`, `mdp`, `role`) VALUES
(1, 'aa', 'aa@aa.fr', '$2b$10$PSJAfBN778PvXUYiTEajkur0q5Qn04NbL7sjaUfRoL.6avdP90sDu', 'admin'),
(8, 'gianib', 'gianibonillo@gmail.com', '$2a$10$fDwPhqN1XhIzF3YC8RDYTeot9aOiPzn92XIA/y9lI7GBfrqsBH6/.', 'admin'),
(9, 'Aurele', 'aurele.beauvieux@gmail.com', '$2a$10$Be5TrPaY04nLBGdc4zi.cOBCvbhBZidNS8X/oLXoIpN6cuwt4bIra', 'admin'),
(10, 'aurele2', 'aurele2003.beauvieux@gmail.com', '$2a$10$ey0XIkW7fPnflKXSPXKHfOr28oCxY.F0Z4K89IaGW5xnN2Iclg.9e', 'user');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `commentaire`
--
ALTER TABLE `commentaire`
  ADD PRIMARY KEY (`id_commentaire`);

--
-- Index pour la table `contribution`
--
ALTER TABLE `contribution`
  ADD PRIMARY KEY (`id_contribution`);

--
-- Index pour la table `espece`
--
ALTER TABLE `espece`
  ADD PRIMARY KEY (`id_espece`);

--
-- Index pour la table `famille`
--
ALTER TABLE `famille`
  ADD PRIMARY KEY (`id_famille`);

--
-- Index pour la table `habitat`
--
ALTER TABLE `habitat`
  ADD PRIMARY KEY (`id_habitat`);

--
-- Index pour la table `historique`
--
ALTER TABLE `historique`
  ADD PRIMARY KEY (`id_historique`);

--
-- Index pour la table `temperament`
--
ALTER TABLE `temperament`
  ADD PRIMARY KEY (`id_temperament`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `commentaire`
--
ALTER TABLE `commentaire`
  MODIFY `id_commentaire` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT pour la table `contribution`
--
ALTER TABLE `contribution`
  MODIFY `id_contribution` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `espece`
--
ALTER TABLE `espece`
  MODIFY `id_espece` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `famille`
--
ALTER TABLE `famille`
  MODIFY `id_famille` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `habitat`
--
ALTER TABLE `habitat`
  MODIFY `id_habitat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `historique`
--
ALTER TABLE `historique`
  MODIFY `id_historique` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `temperament`
--
ALTER TABLE `temperament`
  MODIFY `id_temperament` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
