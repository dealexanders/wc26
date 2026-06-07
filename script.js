const TEAMS = {
  "MEX": [
    "Mexico",
    "mx"
  ],
  "RSA": [
    "South Africa",
    "za"
  ],
  "KOR": [
    "Korea Republic",
    "kr"
  ],
  "CZE": [
    "Czechia",
    "cz"
  ],
  "CAN": [
    "Canada",
    "ca"
  ],
  "BIH": [
    "Bosnia and Herzegovina",
    "ba"
  ],
  "QAT": [
    "Qatar",
    "qa"
  ],
  "SUI": [
    "Switzerland",
    "ch"
  ],
  "BRA": [
    "Brazil",
    "br"
  ],
  "MAR": [
    "Morocco",
    "ma"
  ],
  "HAI": [
    "Haiti",
    "ht"
  ],
  "SCO": [
    "Scotland",
    "gb-sct"
  ],
  "USA": [
    "USA",
    "us"
  ],
  "PAR": [
    "Paraguay",
    "py"
  ],
  "AUS": [
    "Australia",
    "au"
  ],
  "TUR": [
    "Türkiye",
    "tr"
  ],
  "GER": [
    "Germany",
    "de"
  ],
  "CUW": [
    "Curaçao",
    "cw"
  ],
  "CIV": [
    "Côte d’Ivoire",
    "ci"
  ],
  "ECU": [
    "Ecuador",
    "ec"
  ],
  "NED": [
    "Netherlands",
    "nl"
  ],
  "JPN": [
    "Japan",
    "jp"
  ],
  "SWE": [
    "Sweden",
    "se"
  ],
  "TUN": [
    "Tunisia",
    "tn"
  ],
  "BEL": [
    "Belgium",
    "be"
  ],
  "EGY": [
    "Egypt",
    "eg"
  ],
  "IRN": [
    "IR Iran",
    "ir"
  ],
  "NZL": [
    "New Zealand",
    "nz"
  ],
  "ESP": [
    "Spain",
    "es"
  ],
  "CPV": [
    "Cabo Verde",
    "cv"
  ],
  "KSA": [
    "Saudi Arabia",
    "sa"
  ],
  "URU": [
    "Uruguay",
    "uy"
  ],
  "FRA": [
    "France",
    "fr"
  ],
  "SEN": [
    "Senegal",
    "sn"
  ],
  "IRQ": [
    "Iraq",
    "iq"
  ],
  "NOR": [
    "Norway",
    "no"
  ],
  "ARG": [
    "Argentina",
    "ar"
  ],
  "ALG": [
    "Algeria",
    "dz"
  ],
  "AUT": [
    "Austria",
    "at"
  ],
  "JOR": [
    "Jordan",
    "jo"
  ],
  "POR": [
    "Portugal",
    "pt"
  ],
  "COD": [
    "Congo DR",
    "cd"
  ],
  "UZB": [
    "Uzbekistan",
    "uz"
  ],
  "COL": [
    "Colombia",
    "co"
  ],
  "ENG": [
    "England",
    "gb-eng"
  ],
  "CRO": [
    "Croatia",
    "hr"
  ],
  "GHA": [
    "Ghana",
    "gh"
  ],
  "PAN": [
    "Panama",
    "pa"
  ]
};
const GROUPS = {
  "A": [
    "MEX",
    "RSA",
    "KOR",
    "CZE"
  ],
  "B": [
    "CAN",
    "BIH",
    "QAT",
    "SUI"
  ],
  "C": [
    "BRA",
    "MAR",
    "HAI",
    "SCO"
  ],
  "D": [
    "USA",
    "PAR",
    "AUS",
    "TUR"
  ],
  "E": [
    "GER",
    "CUW",
    "CIV",
    "ECU"
  ],
  "F": [
    "NED",
    "JPN",
    "SWE",
    "TUN"
  ],
  "G": [
    "BEL",
    "EGY",
    "IRN",
    "NZL"
  ],
  "H": [
    "ESP",
    "CPV",
    "KSA",
    "URU"
  ],
  "I": [
    "FRA",
    "SEN",
    "IRQ",
    "NOR"
  ],
  "J": [
    "ARG",
    "ALG",
    "AUT",
    "JOR"
  ],
  "K": [
    "POR",
    "COD",
    "UZB",
    "COL"
  ],
  "L": [
    "ENG",
    "CRO",
    "GHA",
    "PAN"
  ]
};
const MATCHES = [
  {
    "no": "1",
    "time": "15:00",
    "team1": "MEX",
    "team2": "RSA",
    "group": "A",
    "date": "11 June",
    "venue": "MEXICO CITY",
    "stage": "Group Stage"
  },
  {
    "no": "2",
    "time": "22:00",
    "team1": "KOR",
    "team2": "CZE",
    "group": "A",
    "date": "11 June",
    "venue": "GUADALAJARA",
    "stage": "Group Stage"
  },
  {
    "no": "3",
    "time": "15:00",
    "team1": "CAN",
    "team2": "BIH",
    "group": "B",
    "date": "12 June",
    "venue": "TORONTO",
    "stage": "Group Stage"
  },
  {
    "no": "5",
    "time": "21:00",
    "team1": "HAI",
    "team2": "SCO",
    "group": "C",
    "date": "13 June",
    "venue": "BOSTON",
    "stage": "Group Stage"
  },
  {
    "no": "6",
    "time": "00:00",
    "team1": "AUS",
    "team2": "TUR",
    "group": "D",
    "date": "13 June",
    "venue": "VANCOUVER",
    "stage": "Group Stage"
  },
  {
    "no": "7",
    "time": "18:00",
    "team1": "BRA",
    "team2": "MAR",
    "group": "C",
    "date": "13 June",
    "venue": "PHILADELPHIA",
    "stage": "Group Stage"
  },
  {
    "no": "8",
    "time": "15:00",
    "team1": "QAT",
    "team2": "SUI",
    "group": "B",
    "date": "13 June",
    "venue": "SAN FRANCISCO BAY AREA",
    "stage": "Group Stage"
  },
  {
    "no": "9",
    "time": "19:00",
    "team1": "CIV",
    "team2": "ECU",
    "group": "E",
    "date": "14 June",
    "venue": "PHILADELPHIA",
    "stage": "Group Stage"
  },
  {
    "no": "10",
    "time": "13:00",
    "team1": "GER",
    "team2": "CUW",
    "group": "E",
    "date": "14 June",
    "venue": "HOUSTON",
    "stage": "Group Stage"
  },
  {
    "no": "11",
    "time": "16:00",
    "team1": "NED",
    "team2": "JPN",
    "group": "F",
    "date": "14 June",
    "venue": "DALLAS",
    "stage": "Group Stage"
  },
  {
    "no": "12",
    "time": "22:00",
    "team1": "SWE",
    "team2": "TUN",
    "group": "F",
    "date": "14 June",
    "venue": "MONTERREY",
    "stage": "Group Stage"
  },
  {
    "no": "13",
    "time": "18:00",
    "team1": "KSA",
    "team2": "URU",
    "group": "H",
    "date": "15 June",
    "venue": "MIAMI",
    "stage": "Group Stage"
  },
  {
    "no": "14",
    "time": "12:00",
    "team1": "ESP",
    "team2": "CPV",
    "group": "H",
    "date": "15 June",
    "venue": "ATLANTA",
    "stage": "Group Stage"
  },
  {
    "no": "15",
    "time": "21:00",
    "team1": "USA",
    "team2": "PAR",
    "group": "D",
    "date": "14 June",
    "venue": "LOS ANGELES",
    "stage": "Group Stage"
  },
  {
    "no": "15",
    "time": "21:00",
    "team1": "IRN",
    "team2": "NZL",
    "group": "G",
    "date": "15 June",
    "venue": "LOS ANGELES",
    "stage": "Group Stage"
  },
  {
    "no": "16",
    "time": "15:00",
    "team1": "BEL",
    "team2": "EGY",
    "group": "G",
    "date": "15 June",
    "venue": "SEATTLE",
    "stage": "Group Stage"
  },
  {
    "no": "17",
    "time": "15:00",
    "team1": "FRA",
    "team2": "SEN",
    "group": "I",
    "date": "16 June",
    "venue": "PHILADELPHIA",
    "stage": "Group Stage"
  },
  {
    "no": "18",
    "time": "18:00",
    "team1": "IRQ",
    "team2": "NOR",
    "group": "I",
    "date": "16 June",
    "venue": "BOSTON",
    "stage": "Group Stage"
  },
  {
    "no": "19",
    "time": "21:00",
    "team1": "ARG",
    "team2": "ALG",
    "group": "J",
    "date": "16 June",
    "venue": "KANSAS CITY",
    "stage": "Group Stage"
  },
  {
    "no": "20",
    "time": "00:00",
    "team1": "AUT",
    "team2": "JOR",
    "group": "J",
    "date": "16 June",
    "venue": "SAN FRANCISCO BAY AREA",
    "stage": "Group Stage"
  },
  {
    "no": "21",
    "time": "19:00",
    "team1": "GHA",
    "team2": "PAN",
    "group": "L",
    "date": "17 June",
    "venue": "TORONTO",
    "stage": "Group Stage"
  },
  {
    "no": "22",
    "time": "16:00",
    "team1": "ENG",
    "team2": "CRO",
    "group": "L",
    "date": "17 June",
    "venue": "DALLAS",
    "stage": "Group Stage"
  },
  {
    "no": "24",
    "time": "22:00",
    "team1": "UZB",
    "team2": "COL",
    "group": "K",
    "date": "17 June",
    "venue": "MEXICO CITY",
    "stage": "Group Stage"
  },
  {
    "no": "25",
    "time": "12:00",
    "team1": "CZE",
    "team2": "RSA",
    "group": "A",
    "date": "18 June",
    "venue": "ATLANTA",
    "stage": "Group Stage"
  },
  {
    "no": "26",
    "time": "15:00",
    "team1": "SUI",
    "team2": "BIH",
    "group": "B",
    "date": "18 June",
    "venue": "LOS ANGELES",
    "stage": "Group Stage"
  },
  {
    "no": "27",
    "time": "18:00",
    "team1": "CAN",
    "team2": "QAT",
    "group": "B",
    "date": "18 June",
    "venue": "VANCOUVER",
    "stage": "Group Stage"
  },
  {
    "no": "28",
    "time": "21:00",
    "team1": "MEX",
    "team2": "KOR",
    "group": "A",
    "date": "18 June",
    "venue": "GUADALAJARA",
    "stage": "Group Stage"
  },
  {
    "no": "29",
    "time": "20:30",
    "team1": "BRA",
    "team2": "HAI",
    "group": "C",
    "date": "19 June",
    "venue": "PHILADELPHIA",
    "stage": "Group Stage"
  },
  {
    "no": "30",
    "time": "18:00",
    "team1": "SCO",
    "team2": "MAR",
    "group": "C",
    "date": "19 June",
    "venue": "BOSTON",
    "stage": "Group Stage"
  },
  {
    "no": "31",
    "time": "23:00",
    "team1": "TUR",
    "team2": "PAR",
    "group": "D",
    "date": "19 June",
    "venue": "SAN FRANCISCO BAY AREA",
    "stage": "Group Stage"
  },
  {
    "no": "32",
    "time": "15:00",
    "team1": "USA",
    "team2": "AUS",
    "group": "D",
    "date": "19 June",
    "venue": "SEATTLE",
    "stage": "Group Stage"
  },
  {
    "no": "33",
    "time": "16:00",
    "team1": "GER",
    "team2": "CIV",
    "group": "E",
    "date": "20 June",
    "venue": "TORONTO",
    "stage": "Group Stage"
  },
  {
    "no": "34",
    "time": "20:00",
    "team1": "ECU",
    "team2": "CUW",
    "group": "E",
    "date": "20 June",
    "venue": "KANSAS CITY",
    "stage": "Group Stage"
  },
  {
    "no": "35",
    "time": "13:00",
    "team1": "NED",
    "team2": "SWE",
    "group": "F",
    "date": "20 June",
    "venue": "HOUSTON",
    "stage": "Group Stage"
  },
  {
    "no": "36",
    "time": "00:00",
    "team1": "TUN",
    "team2": "JPN",
    "group": "F",
    "date": "20 June",
    "venue": "MONTERREY",
    "stage": "Group Stage"
  },
  {
    "no": "37",
    "time": "18:00",
    "team1": "URU",
    "team2": "CPV",
    "group": "H",
    "date": "21 June",
    "venue": "MIAMI",
    "stage": "Group Stage"
  },
  {
    "no": "38",
    "time": "12:00",
    "team1": "ESP",
    "team2": "KSA",
    "group": "H",
    "date": "21 June",
    "venue": "ATLANTA",
    "stage": "Group Stage"
  },
  {
    "no": "39",
    "time": "15:00",
    "team1": "BEL",
    "team2": "IRN",
    "group": "G",
    "date": "21 June",
    "venue": "LOS ANGELES",
    "stage": "Group Stage"
  },
  {
    "no": "40",
    "time": "21:00",
    "team1": "NZL",
    "team2": "EGY",
    "group": "G",
    "date": "21 June",
    "venue": "VANCOUVER",
    "stage": "Group Stage"
  },
  {
    "no": "41",
    "time": "20:00",
    "team1": "NOR",
    "team2": "SEN",
    "group": "I",
    "date": "22 June",
    "venue": "PHILADELPHIA",
    "stage": "Group Stage"
  },
  {
    "no": "42",
    "time": "17:00",
    "team1": "FRA",
    "team2": "IRQ",
    "group": "I",
    "date": "22 June",
    "venue": "PHILADELPHIA",
    "stage": "Group Stage"
  },
  {
    "no": "43",
    "time": "13:00",
    "team1": "ARG",
    "team2": "AUT",
    "group": "J",
    "date": "22 June",
    "venue": "DALLAS",
    "stage": "Group Stage"
  },
  {
    "no": "44",
    "time": "23:00",
    "team1": "JOR",
    "team2": "ALG",
    "group": "J",
    "date": "22 June",
    "venue": "SAN FRANCISCO BAY AREA",
    "stage": "Group Stage"
  },
  {
    "no": "45",
    "time": "16:00",
    "team1": "ENG",
    "team2": "GHA",
    "group": "L",
    "date": "23 June",
    "venue": "BOSTON",
    "stage": "Group Stage"
  },
  {
    "no": "46",
    "time": "19:00",
    "team1": "PAN",
    "team2": "CRO",
    "group": "L",
    "date": "23 June",
    "venue": "TORONTO",
    "stage": "Group Stage"
  },
  {
    "no": "47",
    "time": "13:00",
    "team1": "POR",
    "team2": "UZB",
    "group": "K",
    "date": "23 June",
    "venue": "HOUSTON",
    "stage": "Group Stage"
  },
  {
    "no": "48",
    "time": "22:00",
    "team1": "COL",
    "team2": "COD",
    "group": "K",
    "date": "23 June",
    "venue": "GUADALAJARA",
    "stage": "Group Stage"
  },
  {
    "no": "49",
    "time": "18:00",
    "team1": "SCO",
    "team2": "BRA",
    "group": "C",
    "date": "24 June",
    "venue": "MIAMI",
    "stage": "Group Stage"
  },
  {
    "no": "50",
    "time": "18:00",
    "team1": "MAR",
    "team2": "HAI",
    "group": "C",
    "date": "24 June",
    "venue": "ATLANTA",
    "stage": "Group Stage"
  },
  {
    "no": "51",
    "time": "15:00",
    "team1": "SUI",
    "team2": "CAN",
    "group": "B",
    "date": "24 June",
    "venue": "VANCOUVER",
    "stage": "Group Stage"
  },
  {
    "no": "52",
    "time": "15:00",
    "team1": "BIH",
    "team2": "QAT",
    "group": "B",
    "date": "24 June",
    "venue": "SEATTLE",
    "stage": "Group Stage"
  },
  {
    "no": "54",
    "time": "21:00",
    "team1": "RSA",
    "team2": "KOR",
    "group": "A",
    "date": "24 June",
    "venue": "MONTERREY",
    "stage": "Group Stage"
  },
  {
    "no": "55",
    "time": "16:00",
    "team1": "CUW",
    "team2": "CIV",
    "group": "E",
    "date": "25 June",
    "venue": "PHILADELPHIA",
    "stage": "Group Stage"
  },
  {
    "no": "56",
    "time": "16:00",
    "team1": "ECU",
    "team2": "GER",
    "group": "E",
    "date": "25 June",
    "venue": "PHILADELPHIA",
    "stage": "Group Stage"
  },
  {
    "no": "57",
    "time": "19:00",
    "team1": "JPN",
    "team2": "SWE",
    "group": "F",
    "date": "25 June",
    "venue": "DALLAS",
    "stage": "Group Stage"
  },
  {
    "no": "58",
    "time": "19:00",
    "team1": "TUN",
    "team2": "NED",
    "group": "F",
    "date": "25 June",
    "venue": "KANSAS CITY",
    "stage": "Group Stage"
  },
  {
    "no": "59",
    "time": "22:00",
    "team1": "TUR",
    "team2": "USA",
    "group": "D",
    "date": "25 June",
    "venue": "LOS ANGELES",
    "stage": "Group Stage"
  },
  {
    "no": "60",
    "time": "22:00",
    "team1": "PAR",
    "team2": "AUS",
    "group": "D",
    "date": "25 June",
    "venue": "SAN FRANCISCO BAY AREA",
    "stage": "Group Stage"
  },
  {
    "no": "61",
    "time": "15:00",
    "team1": "NOR",
    "team2": "FRA",
    "group": "I",
    "date": "26 June",
    "venue": "BOSTON",
    "stage": "Group Stage"
  },
  {
    "no": "62",
    "time": "15:00",
    "team1": "SEN",
    "team2": "IRQ",
    "group": "I",
    "date": "26 June",
    "venue": "TORONTO",
    "stage": "Group Stage"
  },
  {
    "no": "63",
    "time": "23:00",
    "team1": "EGY",
    "team2": "IRN",
    "group": "G",
    "date": "26 June",
    "venue": "SEATTLE",
    "stage": "Group Stage"
  },
  {
    "no": "64",
    "time": "23:00",
    "team1": "NZL",
    "team2": "BEL",
    "group": "G",
    "date": "26 June",
    "venue": "VANCOUVER",
    "stage": "Group Stage"
  },
  {
    "no": "65",
    "time": "20:00",
    "team1": "CPV",
    "team2": "KSA",
    "group": "H",
    "date": "26 June",
    "venue": "HOUSTON",
    "stage": "Group Stage"
  },
  {
    "no": "66",
    "time": "20:00",
    "team1": "URU",
    "team2": "ESP",
    "group": "H",
    "date": "26 June",
    "venue": "GUADALAJARA",
    "stage": "Group Stage"
  },
  {
    "no": "67",
    "time": "17:00",
    "team1": "PAN",
    "team2": "ENG",
    "group": "L",
    "date": "27 June",
    "venue": "PHILADELPHIA",
    "stage": "Group Stage"
  },
  {
    "no": "68",
    "time": "17:00",
    "team1": "CRO",
    "team2": "GHA",
    "group": "L",
    "date": "27 June",
    "venue": "PHILADELPHIA",
    "stage": "Group Stage"
  },
  {
    "no": "69",
    "time": "22:00",
    "team1": "ALG",
    "team2": "AUT",
    "group": "J",
    "date": "27 June",
    "venue": "KANSAS CITY",
    "stage": "Group Stage"
  },
  {
    "no": "70",
    "time": "22:00",
    "team1": "JOR",
    "team2": "ARG",
    "group": "J",
    "date": "27 June",
    "venue": "DALLAS",
    "stage": "Group Stage"
  },
  {
    "no": "71",
    "time": "19:30",
    "team1": "COL",
    "team2": "POR",
    "group": "K",
    "date": "27 June",
    "venue": "MIAMI",
    "stage": "Group Stage"
  },
  {
    "no": "72",
    "time": "19:30",
    "team1": "COD",
    "team2": "UZB",
    "group": "K",
    "date": "27 June",
    "venue": "ATLANTA",
    "stage": "Group Stage"
  },
  {
    "no": "73",
    "time": "15:00",
    "team1": "2A",
    "team2": "2B",
    "group": "",
    "date": "28 June",
    "venue": "LOS ANGELES",
    "stage": "Knockout"
  },
  {
    "no": "74",
    "time": "16:30",
    "team1": "1E",
    "team2": "3",
    "group": "",
    "date": "29 June",
    "venue": "BOSTON",
    "stage": "Knockout"
  },
  {
    "no": "75",
    "time": "21:00",
    "team1": "1F",
    "team2": "2C",
    "group": "",
    "date": "29 June",
    "venue": "MONTERREY",
    "stage": "Knockout"
  },
  {
    "no": "76",
    "time": "13:00",
    "team1": "1C",
    "team2": "2F",
    "group": "",
    "date": "29 June",
    "venue": "HOUSTON",
    "stage": "Knockout"
  },
  {
    "no": "77",
    "time": "17:00",
    "team1": "1I",
    "team2": "3",
    "group": "",
    "date": "30 June",
    "venue": "PHILADELPHIA",
    "stage": "Knockout"
  },
  {
    "no": "78",
    "time": "13:00",
    "team1": "2E",
    "team2": "2I",
    "group": "",
    "date": "30 June",
    "venue": "DALLAS",
    "stage": "Knockout"
  },
  {
    "no": "79",
    "time": "21:00",
    "team1": "1A",
    "team2": "3",
    "group": "",
    "date": "30 June",
    "venue": "MEXICO CITY",
    "stage": "Knockout"
  },
  {
    "no": "80",
    "time": "12:00",
    "team1": "1L",
    "team2": "3",
    "group": "",
    "date": "1 July",
    "venue": "ATLANTA",
    "stage": "Knockout"
  },
  {
    "no": "81",
    "time": "20:00",
    "team1": "1D",
    "team2": "3",
    "group": "",
    "date": "1 July",
    "venue": "SAN FRANCISCO BAY AREA",
    "stage": "Knockout"
  },
  {
    "no": "82",
    "time": "16:00",
    "team1": "1G",
    "team2": "3",
    "group": "",
    "date": "1 July",
    "venue": "SEATTLE",
    "stage": "Knockout"
  },
  {
    "no": "83",
    "time": "19:00",
    "team1": "2K",
    "team2": "2L",
    "group": "",
    "date": "2 July",
    "venue": "TORONTO",
    "stage": "Knockout"
  },
  {
    "no": "84",
    "time": "15:00",
    "team1": "1H",
    "team2": "2J",
    "group": "",
    "date": "2 July",
    "venue": "LOS ANGELES",
    "stage": "Knockout"
  },
  {
    "no": "85",
    "time": "23:00",
    "team1": "1B",
    "team2": "3",
    "group": "",
    "date": "2 July",
    "venue": "VANCOUVER",
    "stage": "Knockout"
  },
  {
    "no": "86",
    "time": "18:00",
    "team1": "1J",
    "team2": "2H",
    "group": "",
    "date": "3 July",
    "venue": "MIAMI",
    "stage": "Knockout"
  },
  {
    "no": "87",
    "time": "21:30",
    "team1": "1K",
    "team2": "3",
    "group": "",
    "date": "3 July",
    "venue": "KANSAS CITY",
    "stage": "Knockout"
  },
  {
    "no": "88",
    "time": "14:00",
    "team1": "2D",
    "team2": "2G",
    "group": "",
    "date": "3 July",
    "venue": "DALLAS",
    "stage": "Knockout"
  },
  {
    "no": "89",
    "time": "17:00",
    "team1": "W74",
    "team2": "W77",
    "group": "",
    "date": "4 July",
    "venue": "PHILADELPHIA",
    "stage": "Knockout"
  },
  {
    "no": "90",
    "time": "13:00",
    "team1": "W73",
    "team2": "W75",
    "group": "",
    "date": "4 July",
    "venue": "HOUSTON",
    "stage": "Knockout"
  },
  {
    "no": "91",
    "time": "16:00",
    "team1": "W76",
    "team2": "W78",
    "group": "",
    "date": "5 July",
    "venue": "PHILADELPHIA",
    "stage": "Knockout"
  },
  {
    "no": "92",
    "time": "20:00",
    "team1": "W79",
    "team2": "W80",
    "group": "",
    "date": "5 July",
    "venue": "MEXICO CITY",
    "stage": "Knockout"
  },
  {
    "no": "93",
    "time": "15:00",
    "team1": "W83",
    "team2": "W84",
    "group": "",
    "date": "6 July",
    "venue": "DALLAS",
    "stage": "Knockout"
  },
  {
    "no": "94",
    "time": "20:00",
    "team1": "W81",
    "team2": "W82",
    "group": "",
    "date": "6 July",
    "venue": "SEATTLE",
    "stage": "Knockout"
  },
  {
    "no": "95",
    "time": "12:00",
    "team1": "W86",
    "team2": "W88",
    "group": "",
    "date": "7 July",
    "venue": "ATLANTA",
    "stage": "Knockout"
  },
  {
    "no": "96",
    "time": "16:00",
    "team1": "W85",
    "team2": "W87",
    "group": "",
    "date": "7 July",
    "venue": "VANCOUVER",
    "stage": "Knockout"
  },
  {
    "no": "97",
    "time": "16:00",
    "team1": "W89",
    "team2": "W90",
    "group": "",
    "date": "9 July",
    "venue": "BOSTON",
    "stage": "Knockout"
  },
  {
    "no": "98",
    "time": "15:00",
    "team1": "W93",
    "team2": "W94",
    "group": "",
    "date": "10 July",
    "venue": "LOS ANGELES",
    "stage": "Knockout"
  },
  {
    "no": "99",
    "time": "17:00",
    "team1": "W91",
    "team2": "W92",
    "group": "",
    "date": "11 July",
    "venue": "MIAMI",
    "stage": "Knockout"
  },
  {
    "no": "100",
    "time": "21:00",
    "team1": "W95",
    "team2": "W96",
    "group": "",
    "date": "11 July",
    "venue": "KANSAS CITY",
    "stage": "Knockout"
  },
  {
    "no": "101",
    "time": "15:00",
    "team1": "W97",
    "team2": "W98",
    "group": "",
    "date": "14 July",
    "venue": "DALLAS",
    "stage": "Knockout"
  },
  {
    "no": "102",
    "time": "15:00",
    "team1": "W99",
    "team2": "W100",
    "group": "",
    "date": "15 July",
    "venue": "ATLANTA",
    "stage": "Knockout"
  },
  {
    "no": "",
    "time": "13:00",
    "team1": "POR",
    "team2": "COD",
    "group": "K",
    "date": "18 June",
    "venue": "HOUSTON",
    "stage": "Group Stage"
  },
  {
    "no": "",
    "time": "",
    "team1": "CZE",
    "team2": "MEX",
    "group": "A",
    "date": "20 June",
    "venue": "MEXICO CITY",
    "stage": "Group Stage"
  },
  {
    "no": "103",
    "time": "17:00",
    "team1": "RU101",
    "team2": "RU102",
    "group": "",
    "date": "18 July",
    "venue": "MIAMI",
    "stage": "Bronze Final"
  },
  {
    "no": "104",
    "time": "15:00",
    "team1": "Winner SF1",
    "team2": "Winner SF2",
    "group": "",
    "date": "19 July",
    "venue": "NEW YORK NEW JERSEY",
    "stage": "Final"
  }
];

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const routes = {home: renderHome, groups: renderGroups, games: renderGames, table: renderTable};
function flag(code){ const t=TEAMS[code]; if(!t) return `<span class="flagFallback">${code}</span>`; return `<span class="fi fi-${t[1]}"></span>`; }
function team(code){ const t=TEAMS[code]; return t ? `<span class="team">${flag(code)}<b>${t[0]}</b><small>${code}</small></span>` : `<span class="team placeholder"><b>${code}</b></span>`; }
function go(){ const page=location.hash.replace('#','')||'home'; $$('.nav a').forEach(a=>a.classList.toggle('active',a.dataset.page===page)); routes[page]?.(); window.scrollTo({top:0,behavior:'smooth'}); }
window.addEventListener('hashchange', go);
function renderHome(){
  $('#app').innerHTML=`<section class="hero"><div><p class="eyebrow">FIFA World Cup 2026 inspired dashboard</p><h1>Mundial 2026</h1><p class="lead">Groups, match grid and schedule table generated from your three screenshots and the uploaded official schedule PDF.</p><div class="stats"><span>12 groups</span><span>48 teams</span><span>104 matches</span><span>16 host cities</span></div></div><div class="trophy" aria-label="trophy"><div class="globe">🏆</div><div class="base">26</div></div></section><section class="groupList">${Object.entries(GROUPS).map(([g,arr])=>`<article class="groupMini group-${g}"><h3>Group ${g}</h3>${arr.map(team).join('')}</article>`).join('')}</section>`;
}
function renderGroups(){ $('#app').innerHTML=`<h2>Groups</h2><p class="sub">Same group breakdown as in the photos.</p><div class="groupsGrid">${Object.entries(GROUPS).map(([g,arr])=>`<article class="groupCard group-${g}"><div class="groupBadge">${g}</div><h3>Group ${g}</h3>${arr.map(team).join('')}</article>`).join('')}</div>`; }
function renderGames(){
 const groupMatches=MATCHES.filter(m=>m.stage==='Group Stage'); const knock=MATCHES.filter(m=>m.stage!=='Group Stage');
 $('#app').innerHTML=`<h2>Games</h2><p class="sub">Compact game grid based on the 104-match screenshot. Use filters to narrow it down.</p><div class="filters"><input id="q" placeholder="Search team, city, date..."><select id="groupFilter"><option value="">All groups/stages</option>${Object.keys(GROUPS).map(g=>`<option>${g}</option>`).join('')}<option>Knockout</option></select></div><div id="gameGrid" class="gameGrid"></div>`;
 const draw=()=>{ const q=$('#q').value.toLowerCase(); const gf=$('#groupFilter').value; let list=MATCHES.filter(m=>{ let text=Object.values(m).join(' ').toLowerCase(); return (!q||text.includes(q)) && (!gf||m.group===gf||(gf==='Knockout'&&m.stage!=='Group Stage')); }); $('#gameGrid').innerHTML=list.map(matchCard).join(''); };
 $('#q').addEventListener('input',draw); $('#groupFilter').addEventListener('change',draw); draw();
}
function matchCard(m){return `<article class="matchCard"><div class="matchMeta"><span>#${m.no||'—'}</span><span>${m.stage}</span><span>${m.group?'Group '+m.group:''}</span></div><div class="versus">${team(m.team1)}<strong>v</strong>${team(m.team2)}</div><div class="where"><span>${m.date}</span><span>${m.time} ET</span><span>${m.venue||'TBC'}</span></div></article>`}
function renderTable(){ $('#app').innerHTML=`<h2>Schedule table</h2><p class="sub">Locations, dates, games and times extracted from the uploaded schedule PDF. Times are Eastern Time.</p><div class="tableWrap"><table><thead><tr><th>#</th><th>Date</th><th>Time</th><th>Location</th><th>Stage</th><th>Group</th><th>Game</th></tr></thead><tbody>${MATCHES.map(m=>`<tr><td>${m.no}</td><td>${m.date}</td><td>${m.time}</td><td>${m.venue}</td><td>${m.stage}</td><td>${m.group||''}</td><td>${team(m.team1)} <b class="v">v</b> ${team(m.team2)}</td></tr>`).join('')}</tbody></table></div>`; }
go();
