<?php
/**
 * Created by PhpStorm.
 * User: David
 * Date: 20/04/2019
 * Time: 11:39
 */

class Connector
{

    /**
     * Paramètres de connexion à la base de données
     */
    private $host       = '127.0.0.1';
    private $port       = '3306';
    private $dbUser      = 'root';
    private $dbPassword  = "";
    private $dbName      = 'memory';

    /**
     * @var PDO
     */
    private $_db;


    public function __construct()
    {
        // Initialisation de la connexion à la BDD
        try{
            $this->_db = new \PDO('mysql:host=' . $this->host . ';dbname=' . $this->dbName .
                ';charset=utf8', $this->dbUser, $this->dbPassword, array(PDO::ATTR_PERSISTENT => true));
            $this->_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->_db->exec("SET CHARACTER SET utf8");
        } catch (\Exception $e) {
            die('Erreur : ' . $e->getMessage());
        }

    }

    /**
     * Retourne un score à partir de son identifiant
     * @param $id int
     * @return object
     */
    public function getScoreById($id)
    {
        $stmt = $this->_db->prepare("SELECT * FROM score WHERE id=:id");
        $stmt->execute(array(
            'id' => $id
        ));
        return $stmt->fetchObject(Score::class);
    }

    /**
     * Retourne la liste des objets `score` selon les paramètres
     *
     * @param null|string $order
     * @param null|int $limit
     * @return array
     */
    public function getAllScores($order = null, $limit = null) {

        $query = "SELECT * FROM score";
        $query .= $order ? ' ORDER BY ' . $order : '';
        $query .= $limit ? ' LIMIT ' . $limit .';' : '';

        $stmt = $this->_db->prepare($query);
        $stmt->execute();
        $scores = array();
        while ($score = $stmt->fetchObject(__CLASS__)) {
            $scores[] = $score;
        }

        return $scores;
    }

    /**
     * Permet l'ajout en BDD d'un Score
     * @param Score $values
     * @return string
     */
    public function insert(Score $values)
    {
        $stmt = $this->_db->prepare("INSERT INTO score(score, clicks) VALUES (:score, :clicks)");
        $stmt->execute(array(
            'score' => $values->getScore(),
            'clicks' => $values->getClicks()
        ));
        return $this->_db->lastInsertId();
    }

    /**
     * Methode de supression de tous les scores
     */
    public function delete()
    {
        $stmt = $this->_db->prepare("DELETE FROM score;");
        $stmt->execute();
    }

}