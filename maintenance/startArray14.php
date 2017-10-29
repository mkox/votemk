<?php

$startA = new startArray();
//print_r($startA->getAll());
print_r(json_encode($startA->getAll()));

class startArray {

    protected $votes = array();
    protected $supervisoryBoards = array();
    protected $numberSB = 10;
    protected $listsOfCandidates = array();
    protected $LOC_id = 0;
    protected $namesOfLOC = array('A', 'B', 'C', 'D');
    protected $parties = array();
    protected $namesOfParties = array('AA', 'BB', 'CC', 'DD');
    protected $candidatesInList = array();
    protected $CIL_id = 0;
    protected $numberCIL = 5;
    protected $similarSBs = false;
    protected $candidatesWithoutSimilarSBs;
    protected $party_id = 0;
    protected $numberParties = 0;

    public function __construct() {
        $this->candidatesWithoutSimilarSBs = $this->numberSB * count($this->namesOfLOC) * $this->numberCIL;
        $this->votes = $this->getVotes();
        $this->votes = $this->getVotes2();
        $this->createParties();
        $this->createSupervisoryBoards();
        $this->createSimilarSupervisoryBoards();
    }

    public function getAll() {
        $all = array(
            'ranking_lists' => $this->getRankingLists(),
            'parties' => $this->parties,
            'supervisory_boards' => $this->supervisoryBoards,
            'lists_of_candidates' => $this->listsOfCandidates,
            'candidates_in_list' => $this->candidatesInList
        );

        return $all;
    }

    protected function createSupervisoryBoards() {
        for ($sb = 1; $sb <= $this->numberSB; $sb++) {
            $this->supervisoryBoards[] = array(
                'id' => $sb,
                'name' => 'SB' . $sb,
                'seats' => array('total' => 5)
            );
            for ($loc = 0; $loc < count($this->namesOfLOC); $loc++) {
                $this->createListOfCandidates($sb, $loc);
            }
        }
    }

    /* Additional SBs that at the moment are only used by national ranking lists. */

    protected function createSimilarSupervisoryBoards() {
        $this->similarSBs = true;
        for ($sb = 1; $sb <= $this->numberSB; $sb++) {
            $this->supervisoryBoards[$sb + ($this->numberSB - 1)] = $this->supervisoryBoards[$sb];
            $this->supervisoryBoards[$sb + ($this->numberSB - 1)]['id'] = $sb + $this->numberSB;
            $this->supervisoryBoards[$sb + ($this->numberSB - 1)]['name'] = 'SB' . ($sb + $this->numberSB);

            for ($loc = 0; $loc < count($this->namesOfLOC); $loc++) {
                $this->createListOfCandidates($sb + $this->numberSB, $loc);
            }
        }
    }

    protected function createListOfCandidates($sb, $loc) {
        $this->LOC_id += 1;
        if ($this->party_id != ($this->numberParties)) {
            $this->party_id += 1;
        } else {
            $this->party_id = 1;
        }
        $this->listsOfCandidates[] = array(
            'id' => $this->LOC_id,
            'supervisory_board_id' => $sb,
            'name' => $this->namesOfLOC[$loc]
        );
        $partyId = $loc + 1; // At the moment ok.
        $this->createCandidatesInList($partyId);
    }

    protected function createCandidatesInList() {
        for ($i = 0; $i < $this->numberCIL; $i++) {
            $this->CIL_id += 1;
            $cidId2 = $this->CIL_id;
            if ($this->similarSBs) {
                $cidId2 = $this->CIL_id - $this->candidatesWithoutSimilarSBs;
            }
            $this->candidatesInList[] = array(
                'id' => $this->CIL_id,
                'listofcandidates_id' => $this->LOC_id,
                'party_joins' => array(0 => array('party_id' => $this->party_id)),
                'votes' => $this->votes[$cidId2]
            );
        }
    }

    protected function createParties() {
        $this->numberParties = count($this->namesOfParties);
        for ($i = 0; $i < $this->numberParties; $i++) {
            $this->parties[] = array(
                'id' => $i + 1,
                'name' => $this->namesOfParties[$i]
            );
        }
    }

    protected function getRankingLists() {
        $rankingLists = array(
            array(
                'id' => 1,
                'name' => 'Ranking list A int',
                'region' => 'international',
                'current' => true,
                'sb_ids' => array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
            ),
            array(
                'id' => 2,
                'name' => 'Ranking list B reg',
                'region' => 'REG1',
                'current' => false,
                'sb_ids' => array(11, 12, 13, 14, 15, 16, 7, 8, 9, 10)
            ),
            array(
                'id' => 3,
                'name' => 'Ranking list C reg',
                'region' => 'REG2',
                'current' => false,
                'sb_ids' => array(1, 2, 3, 4, 5, 6, 17, 18, 19, 20)
            )
        );
        return $rankingLists;
    }

    public function getVotes() {
        $votes = array(
            1 => array(179, 41),
            2 => array(210, 21),
            3 => array(147, 42),
            4 => array(11, 0),
            5 => array(78, 4),
            6 => array(411, 31),
            7 => array(517, 203),
            8 => array(213, 15),
            9 => array(87, 31),
            10 => array(72, 8),
            11 => array(1013, 53),
            12 => array(1307, 41),
            13 => array(512, 354),
            14 => array(280, 51),
            15 => array(13, 0),
            16 => array(1417, 403),
            17 => array(1087, 203),
            18 => array(313, 21),
            19 => array(548, 44),
            20 => array(446, 61),
            21 => array(280, 120),
            22 => array(160, 131),
            23 => array(191, 60),
            24 => array(81, 12),
            25 => array(63, 14),
            26 => array(351, 45),
            27 => array(474, 71),
            28 => array(504, 114),
            29 => array(171, 24),
            30 => array(200, 13),
            31 => array(1487, 574),
            32 => array(1212, 631),
            33 => array(412, 21),
            34 => array(617, 103),
            35 => array(182, 14),
            36 => array(912, 223),
            37 => array(613, 218),
            38 => array(412, 104),
            39 => array(389, 105),
            40 => array(1293, 113),
            41 => array(211, 14),
            42 => array(141, 31),
            43 => array(78, 5),
            44 => array(187, 2),
            45 => array(58, 0),
            46 => array(711, 248),
            47 => array(103, 147),
            48 => array(326, 112),
            49 => array(351, 37),
            50 => array(159, 45),
            51 => array(1651, 289),
            52 => array(1253, 341),
            53 => array(491, 112),
            54 => array(611, 121),
            55 => array(206, 87),
            56 => array(1384, 357),
            57 => array(1625, 312),
            58 => array(897, 214),
            59 => array(307, 89),
            60 => array(570, 187),
            61 => array(173, 65),
            62 => array(247, 121),
            63 => array(204, 112),
            64 => array(68, 12),
            65 => array(33, 21),
            66 => array(661, 251),
            67 => array(312, 198),
            68 => array(241, 58),
            69 => array(41, 9),
            70 => array(95, 21),
            71 => array(813, 121),
            72 => array(1248, 307),
            73 => array(512, 201),
            74 => array(105, 8),
            75 => array(691, 41),
            76 => array(1713, 507),
            77 => array(913, 154),
            78 => array(1217, 206),
            79 => array(224, 54),
            80 => array(384, 108),
            81 => array(178, 21),
            82 => array(164, 34),
            83 => array(231, 31),
            84 => array(47, 3),
            85 => array(91, 12),
            86 => array(217, 45),
            87 => array(241, 65),
            88 => array(187, 41),
            89 => array(1174, 213),
            90 => array(106, 47),
            91 => array(1587, 31),
            92 => array(1421, 27),
            93 => array(412, 102),
            94 => array(217, 15),
            95 => array(53, 8),
            96 => array(1157, 254),
            97 => array(843, 112),
            98 => array(861, 341),
            99 => array(137, 54),
            100 => array(219, 135),
            101 => array(217, 45),
            102 => array(123, 31),
            103 => array(219, 40),
            104 => array(98, 17),
            105 => array(32, 9),
            106 => array(715, 203),
            107 => array(401, 121),
            108 => array(453, 251),
            109 => array(107, 41),
            110 => array(141, 45),
            111 => array(1691, 457),
            112 => array(1153, 215),
            113 => array(1146, 198),
            114 => array(351, 32),
            115 => array(134, 12),
            116 => array(2341, 145),
            117 => array(841, 124),
            118 => array(517, 64),
            119 => array(583, 45),
            120 => array(96, 5),
            121 => array(147, 45),
            122 => array(163, 30),
            123 => array(46, 17),
            124 => array(51, 8),
            125 => array(43, 14),
            126 => array(871, 245),
            127 => array(713, 284),
            128 => array(219, 45),
            129 => array(143, 21),
            130 => array(29, 2),
            131 => array(1413, 41),
            132 => array(742, 204),
            133 => array(1541, 102),
            134 => array(487, 21),
            135 => array(378, 13),
            136 => array(1754, 461),
            137 => array(1142, 351),
            138 => array(887, 153),
            139 => array(309, 87),
            140 => array(97, 23),
            141 => array(297, 49),
            142 => array(288, 41),
            143 => array(153, 37),
            144 => array(114, 11),
            145 => array(98, 15),
            146 => array(374, 46),
            147 => array(213, 57),
            148 => array(316, 31),
            149 => array(86, 15),
            150 => array(36, 12),
            151 => array(2217, 452),
            152 => array(1467, 301),
            153 => array(217, 54),
            154 => array(128, 41),
            155 => array(202, 21),
            156 => array(811, 101),
            157 => array(2117, 217),
            158 => array(741, 254),
            159 => array(447, 53),
            160 => array(265, 22),
            161 => array(417, 41),
            162 => array(281, 81),
            163 => array(134, 23),
            164 => array(98, 17),
            165 => array(70, 12),
            166 => array(281, 31),
            167 => array(303, 34),
            168 => array(297, 42),
            169 => array(187, 17),
            170 => array(115, 14),
            171 => array(1452, 507),
            172 => array(1151, 421),
            173 => array(507, 231),
            174 => array(213, 89),
            175 => array(65, 21),
            176 => array(1117, 309),
            177 => array(1241, 204),
            178 => array(419, 126),
            179 => array(541, 131),
            180 => array(231, 81),
            181 => array(138, 42),
            182 => array(155, 29),
            183 => array(37, 12),
            184 => array(41, 17),
            185 => array(29, 6),
            186 => array(349, 47),
            187 => array(289, 39),
            188 => array(180, 62),
            189 => array(169, 32),
            190 => array(88, 4),
            191 => array(927, 203),
            192 => array(1448, 141),
            193 => array(324, 88),
            194 => array(217, 61),
            195 => array(123, 48),
            196 => array(1268, 257),
            197 => array(1227, 268),
            198 => array(403, 104),
            199 => array(418, 98),
            200 => array(306, 76),
        );

        return $votes;
    }
    /*
    public function getVotes2() {
        $votes2 = [];
        $regions = ['REG1','REG2','REG3','REG4'];
        $sumRegions = count($regions);
        for($i = 1; $i <= count($this->votes); $i++){
            $votesOfRegions = [];
            $partOfVotesInternational = 0;
            //for($r = 0; $r <= count($sumRegions - 3); $r++){
            for($r = 0; $r <= ($sumRegions - 3); $r++){
                $votesOfRegions[$regions[$r]] = round($this->votes[$i][0] / ($sumRegions) ) + $r + 1;
                $partOfVotesInternational += $votesOfRegions[$regions[$r]];
            }
            $votesOfRegions[$regions[$sumRegions - 2]] = $this->votes[$i][0] - $partOfVotesInternational - $this->votes[$i][1];
            $votesOfRegions[$regions[$sumRegions - 1]] = $this->votes[$i][1];
            $votes2[$i] = $votesOfRegions;
        }
        return $votes2;
    }
    */
    
    public function getVotes2() {
        $votes2 = [];
        $regions = ['REG1','REG2','REG3','REG4'];
        $sumRegions = count($regions);
        for($i = 1; $i <= count($this->votes); $i++){
            $votesOfRegions = [];
            $partOfVotesInternational = 0;
            for($r = 3; $r < $sumRegions; $r++){
                $votesOfRegions[$regions[$r]] = round($this->votes[$i][0] / ($sumRegions) ) + $r;
                $partOfVotesInternational += $votesOfRegions[$regions[$r]];
            }
            $votesOfRegions[$regions[2]] = $this->votes[$i][0] - $partOfVotesInternational - (2 * $this->votes[$i][1]);
            $votesOfRegions[$regions[1]] = $votesOfRegions[$regions[0]] = $this->votes[$i][1];
            $votes2[$i] = $votesOfRegions;
        }
        return $votes2;
    }

}

?>
