<?php
/**
 * Created by PhpStorm.
 * User: David
 * Date: 20/04/2019
 * Time: 10:10
 */

require 'Server/Db/Connector.php';
require_once 'Server/Entity/Score.php';

// Vérification de la présence du paramètre `q`.
if(!isset($_GET['q'])){
    die('Erreur : Certaines données requises sont manquantes !');
}

// On définit la variable `$isXmlHttpRequest` afin de pouvoir
// tester si c'est un appel asynchrone ou non.
$isXmlHttpRequest = false;
if ( !empty($_SERVER['HTTP_X_REQUESTED_WITH'])
    && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' ) {
    $isXmlHttpRequest = true;
}

// Traitement des différentes requêtes.
switch ($_GET['q']){

    case 'randomize':
        // retourne deux tableaux de 14 éléments "battus"
        $card1 = $card2 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
        shuffle($card1);
        shuffle($card2);
        // au format json
        header('Content-Type: application/json');
        echo json_encode([
            $card1, $card2
        ]);

        break;

    case 'readAll':
        // Retourne la liste des scores
        // Definition des paramêtres pour la requête SQL
        $order = isset($_POST['order']) ? $_POST['order'] : null;
        $limit = isset($_POST['limit']) ? $_POST['limit'] : null;

        // Récuperation des données
        $db = new Connector();
        $scores = $db->getAllScores($order, $limit);
        // Affichage au format json
        header('Content-Type: application/json');
        echo json_encode($scores);

        break;

    case 'newScore':
        // Enregistre un nouveau score
        $score = new Score();
        $score->setClicks($_POST['clicks']);
        $score->setScore($_POST['score']);

        $db = new Connector();
        $db->insert($score);

        break;

    case 'delete':
        // Supprime les score enregistrés
        if(!$isXmlHttpRequest){
            // l'accès n'est pas possible directement depuis le navigateur
            echo 'Accès refusé !';
        } else {
            // mais uniquement avec une requête asynchrone
            $db = new Connector();
            $db->delete();
        }

        break;

    default:
        $data = "Cette requête n'est pas disponible.";

        break;
}
