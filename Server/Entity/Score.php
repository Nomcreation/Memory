<?php

/**
 * Class Score
 * Methodes et paramètres pour l'object Score
 */
class Score
{

    /**
     * @var int
     */
    private $id;

    /**
     * @var int
     */
    private $score;

    /**
     * @var int
     */
    private $clicks;

    /**
     * @var datetime
     */
    private $score_date;

    /**
     * Score constructor.
     */
    public function __construct()
    {
        $this->id = $this->score_date = null;
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getScore()
    {
        return $this->score;
    }

    /**
     * @param mixed $score
     */
    public function setScore($score)
    {
        $this->score = $score;
    }

    /**
     * @return mixed
     */
    public function getClicks()
    {
        return $this->clicks;
    }

    /**
     * @param mixed $clicks
     */
    public function setClicks($clicks)
    {
        $this->clicks = $clicks;
    }

    /**
     * @return mixed
     */
    public function getScoreDate()
    {
        return $this->score_date;
    }

    /**
     * @param mixed $score_date
     */
    public function setScoreDate($score_date)
    {
        $this->score_date = $score_date;
    }


}