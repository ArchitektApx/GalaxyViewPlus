/**
 * StaticData contains all static values used in the script.
 * @class
 * @returns  {StaticData} - The StaticData class
 * @typedef  {object}     Config
 * @property {string}     configVersion - The version of the config.
 * @property {Array}      features      - The features of the config.
 * @property {object}     userInterface - The userInterface of the config.
 */
export default class StaticData {
  // static values like the default config
  // maybe localized strings in the future?

  // statsInterface cleanup interval in hours
  static CLEANUP_INTERVAL = 24 * 7
  static DEBUG_LOG_MAX_ENTRIES = 20
  // default config of this build
  static DEFAULT_CONFIG = {
    configVersion : '1.0.6',
    features      : [
      {
        active           : true,
        dataType         : 'ValueTable',
        description      : 'Färbt den Usernamen des Users ein.',
        displayName      : 'Usernamen Färben',
        feature          : 'userRecolor',
        htmlPrefix       : 'userRecolor',
        keyDefault       : 'BeispielUserName',
        keyDescription   : 'Der Username des Users',
        keyDisplayName   : 'Username',
        keyInputType     : 'text',
        keyName          : 'Username',
        sortData         : true,
        valueDefault     : '#ffa700',
        valueDescription : 'Die Farbe welche für den Usernamen verwendet wird',
        valueDisplayName : 'Farbe',
        valueInputType   : 'color',
        valueName        : 'Farbe',

        data: [
          { key: 'BeispielUserName', value: '#ffa700' },
        ],
      },
      {
        active           : true,
        dataType         : 'ValueTable',
        description      : 'Färbt den Rank des Users ein.',
        displayName      : 'Rank Färben',
        feature          : 'rankRecolor',
        htmlPrefix       : 'rankRecolor',
        keyDefault       : 0,
        keyDescription   : 'Der Rang ab welchem die Farbe angewant wird',
        keyDisplayName   : 'Rank',
        keyInputType     : 'number',
        keyName          : 'Rank',
        sortData         : true,
        valueDefault     : '#2cba00',
        valueDescription : 'Die Farbe welche für den Rang verwendet wird',
        valueDisplayName : 'Farbe',
        valueInputType   : 'color',
        valueName        : 'Farbe',

        data: [
          { key: 0, value: '#2cba00' }, // green
          { key: 200, value: '#a3ff00' }, // light green
          { key: 500, value: '#fff400' }, // yellow
          { key: 600, value: '#ffa700' }, // orange
          { key: 700, value: '#ff0000' }, // red
        ],
      },
      {
        active      : false,
        dataType    : 'ValueList',
        description : 'Färbt inaktive User ein.',
        displayName : 'Inaktive Färben',
        feature     : 'inactiveRecolor',
        htmlPrefix  : 'inactiveRecolor',

        data: [
          {
            displayName      : 'Inaktiv (i)',
            inputType        : 'color',
            key              : 'inactiveColor',
            value            : '#f70fff',
            valueDescription : 'Inaktiv (i)',
          },
          {
            displayName      : 'Lange i (i l)',
            inputType        : 'color',
            key              : 'longInactiveColor',
            value            : '#ff00ff',
            valueDescription : 'Lange Inaktiv (i l)',
          },
        ],
      },
      {
        active      : true,
        dataType    : 'ValueList',
        description : 'Zeigt die Anzahl der Planeten/Monde im Umkreis des aktuellen Systems an. Achtung: funktioniert nur wenn Planeten/Mond Infos durch Syncs/Json/CSV vorhanden sind!',
        displayName : 'RangeInfo',
        feature     : 'rangeInfo',
        htmlPrefix  : 'rangeInfo',

        data: [
          {
            displayName      : 'Radius',
            inputType        : 'number',
            key              : 'nearRange',
            value            : 20,
            valueDescription : 'Anzahl der System vor/nach dem aktuellen welche überprüft werden.',
          },
          {
            displayName      : 'Min. Sys.',
            inputType        : 'number',
            key              : 'minSys',
            value            : 1,
            valueDescription : 'Das erste System in der Galaxy. Mach etzadla kein Unfug häddix8 ghabt!',
          },
          {
            displayName      : 'Max. Sys.',
            inputType        : 'number',
            key              : 'maxSys',
            value            : 400,
            valueDescription : 'Das letzte System in der Galaxy. Mach etzadla kein Unfug häddix8 ghabt!',
          },
        ],
      },
      {
        active      : false,
        dataType    : 'ValueList',
        description : 'Verändert den Rang welcher im Galaxy View angezeigt wird',
        displayName : 'Rangtyp (für Rank färben) wählen',
        feature     : 'rankSelector',
        htmlPrefix  : 'rankSelector',

        data: [
          {
            checked          : true,
            displayName      : 'Gesamt',
            inputType        : 'radio',
            key              : 'rankSelect',
            value            : 'rank',
            valueDescription : 'rankSelect',
          },
          {
            checked          : false,
            displayName      : 'Gebäude',
            inputType        : 'radio',
            key              : 'rankSelect',
            value            : 'buildingRank',
            valueDescription : 'rankSelect',
          },
          {
            checked          : false,
            displayName      : 'Forschung',
            inputType        : 'radio',
            key              : 'rankSelect',
            value            : 'researchRank',
            valueDescription : 'rankSelect',
          },
          {
            checked          : false,
            displayName      : 'Flotte',
            inputType        : 'radio',
            key              : 'rankSelect',
            value            : 'fleetRank',
            valueDescription : 'rankSelect',
          },
          {
            checked          : false,
            displayName      : 'Verteidigung',
            inputType        : 'radio',
            key              : 'rankSelect',
            value            : 'defensiveRank',
            valueDescription : 'rankSelect',
          },
        ],
      },
      {
        active      : true,
        dataType    : 'ValueList',
        description : 'Einstellungen die sich nicht auf Spieler sondern das Skript ansich beziehen.',
        displayName : 'Generelle Einstellungen',
        feature     : 'generalsettings',
        htmlPrefix  : 'generalsettings',

        data: [
          {
            checked          : true,
            displayName      : 'Sync Shortcut auf E',
            inputType        : 'checkbox',
            key              : 'syncbutton',
            value            : 'syncbutton',
            valueDescription : 'Shortcut der den Sync Button auf die e-Taste legt',
          },
          {
            checked          : false,
            displayName      : 'Debug Infos anzeigen',
            inputType        : 'checkbox',
            key              : 'debugInfo',
            value            : 'debugInfo',
            valueDescription : 'Zeigt Informationen über das Script an',
          },
          {
            checked          : false,
            displayName      : 'Debug Log anzeigen',
            inputType        : 'checkbox',
            key              : 'debugLog',
            value            : 'debugLog',
            valueDescription : 'Zeigt Log Informationen der Module an',
          },
          {
            checked          : false,
            displayName      : 'Config offen halten',
            inputType        : 'checkbox',
            key              : 'configOpen',
            value            : 'configOpen',
            valueDescription : 'Öffnet die Config beim Start',
          },
        ],
      },
    ],
    userInterface: {
      css: `
                .settings-interface-wrapper {
                    margin-top: 10px;
                    margin-bottom: 10px;
                    width: 100%;
                }

                .feature-settings-container {
                    width: calc(50% - 20px);
                    margin-left: 10px;
                    margin-right: 10px;
                    display: inline-block;
                    vertical-align: top;
                }

                .feature-header-title {
                  font-weight: bold;
                }

                .feature-header-container {
                  margin-bottom: 10px;
                }

                .feature-header-container label,
                .feature-header-container input[type="checkbox"] {
                  display: inline-block;
                  vertical-align: top; /* Align label and checkbox at the top of their line */
                }

                .feature-header-container label:nth-of-type(1)
                .feature-header-container input[type="checkbox"]:nth-of-type(1) {
                  float: left;
                }

                .feature-header-container label:nth-of-type(2){
                  clear: left;
                  margin-left: 5%;
                }

                .feature-header-container p,
                .feature-header-container label {
                  text-align: left;
                }

                .feature-header-container label {
                    width: 20%;
                }

                .feature-body-container {
                    width: 80%;
                }

                .feature-body-container table {
                    width: 100%;
                }

                .feature-body-container button {
                    margin-top: 10px;
                }

                .ValueList-row {
                    margin-bottom: 10px;
                }

                .ValueList-row label {
                    display: inline-block;
                }

                .hidden {
                    display: none;
                }

                #settings-interface-footer {
                    margin-top: 20px;
                    width: 100%;
                    text-align: center;
                } 
                `,
      title: 'Galaxy View Plus Config',
    },
  }

  // json patch definition to remove userdata from the config
  static JSON_PATCH_USERDATA = [
    { op: 'remove', path: [ 'features', 5, 'data' ] },
    { op: 'remove', path: [ 'features', 5, 'active' ] },
    { op: 'remove', path: [ 'features', 4, 'data' ] },
    { op: 'remove', path: [ 'features', 4, 'active' ] },
    { op: 'remove', path: [ 'features', 3, 'data' ] },
    { op: 'remove', path: [ 'features', 3, 'active' ] },
    { op: 'remove', path: [ 'features', 2, 'data' ] },
    { op: 'remove', path: [ 'features', 2, 'active' ] },
    { op: 'remove', path: [ 'features', 1, 'data' ] },
    { op: 'remove', path: [ 'features', 1, 'sortData' ] },
    { op: 'remove', path: [ 'features', 1, 'active' ] },
    { op: 'remove', path: [ 'features', 0, 'data' ] },
    { op: 'remove', path: [ 'features', 0, 'sortData' ] },
    { op: 'remove', path: [ 'features', 0, 'active' ] },
  ]

  // keys of all settings saved to storage
  static STORAGE_KEYS = {
    CLEANUP_STATUS : 'GalaxyViewPlus_CleanupStatus',
    DEBUG_LOG      : 'GalaxyViewPlus_DebugLog',
    STATS_DATA     : 'GalaxyViewPlus_StatsData',
    UPDATE_STATUS  : 'GalaxyViewPlus_UpdateStatus',
    USER_CONFIG    : 'GalaxyViewPlus_Config',
  } // allowed values are localStorage or GM

  static STORAGE_TYPE = 'localStorage' // in hours
  static UPDATE_INTERVAL = 6 // Minutes
  static UPDATE_INTERVAL_DELAY = 2 // in hours
  static UPDATE_INTERVAL_STARTTIME = 0
}
