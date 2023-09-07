export default class StaticData {
  // static values like the default config
  // maybe localized strings in the future?

  // statsInterface cleanup interval in hours
  static CLEANUP_INTERVAL = 24 * 7

  static DEBUG_LOG_MAX_ENTRIES = 20
  // default config of this build
  static DEFAULT_CONFIG = {
    configVersion : '1.0.5',
    features      : [
      {
        feature          : 'userRecolor',
        displayName      : 'Usernamen Färben',
        description      : 'Färbt den Usernamen des Users ein.',
        active           : true,
        htmlPrefix       : 'userRecolor',
        dataType         : 'ValueTable',
        keyName          : 'Username',
        keyDescription   : 'Der Username des Users',
        keyDisplayName   : 'Username',
        keyInputType     : 'text',
        keyDefault       : 'BeispielUserName',
        valueName        : 'Farbe',
        valueDescription : 'Die Farbe welche für den Usernamen verwendet wird',
        valueDisplayName : 'Farbe',
        valueInputType   : 'color',
        valueDefault     : '#ffa700',
        data             : [
          { key: 'BeispielUserName', value: '#ffa700' },
        ],
        sortData: true,
      },
      {
        feature          : 'rankRecolor',
        displayName      : 'Rank Färben',
        description      : 'Färbt den Rank des Users ein.',
        active           : true,
        htmlPrefix       : 'rankRecolor',
        dataType         : 'ValueTable',
        keyName          : 'Rank',
        keyDescription   : 'Der Rang ab welchem die Farbe angewant wird',
        keyDisplayName   : 'Rank',
        keyInputType     : 'number',
        keyDefault       : 0,
        valueName        : 'Farbe',
        valueDescription : 'Die Farbe welche für den Rang verwendet wird',
        valueDisplayName : 'Farbe',
        valueInputType   : 'color',
        valueDefault     : '#2cba00',
        data             : [
          { key: 0, value: '#2cba00' }, // green
          { key: 200, value: '#a3ff00' }, // light green
          { key: 500, value: '#fff400' }, // yellow
          { key: 600, value: '#ffa700' }, // orange
          { key: 700, value: '#ff0000' }, // red
        ],
        sortData: true,
      },
      {
        feature     : 'inactiveRecolor',
        displayName : 'Inaktive Färben',
        description : 'Färbt inaktive User ein.',
        active      : false,
        htmlPrefix  : 'inactiveRecolor',
        dataType    : 'ValueList',
        data        : [
          {
            key              : 'inactiveColor',
            valueDescription : 'Inaktiv (i)',
            displayName      : 'Inaktiv (i)',
            inputType        : 'color',
            value            : '#f70fff',
          },
          {
            key              : 'longInactiveColor',
            valueDescription : 'Lange Inaktiv (i l)',
            displayName      : 'Lange i (i l)',
            inputType        : 'color',
            value            : '#ff00ff',
          },
        ],
      },
      {
        feature     : 'rangeInfo',
        displayName : 'RangeInfo',
        description : 'Zeigt die Anzahl der Planeten/Monde im Umkreis des aktuellen Systems an. Achtung: funktioniert nur wenn Planeten/Mond Infos durch Syncs/Json/CSV vorhanden sind!',
        active      : true,
        htmlPrefix  : 'rangeInfo',
        dataType    : 'ValueList',
        data        : [
          {
            key              : 'nearRange',
            valueDescription : 'Anzahl der System vor/nach dem aktuellen welche überprüft werden.',
            displayName      : 'Radius',
            inputType        : 'number',
            value            : 20,
          },
          {
            key              : 'minSys',
            valueDescription : 'Das erste System in der Galaxy. Mach etzadla kein Unfug häddix8 ghabt!',
            displayName      : 'Min. Sys.',
            inputType        : 'number',
            value            : 1,
          },
          {
            key              : 'maxSys',
            valueDescription : 'Das letzte System in der Galaxy. Mach etzadla kein Unfug häddix8 ghabt!',
            displayName      : 'Max. Sys.',
            inputType        : 'number',
            value            : 400,
          },
        ],
      },
      {
        feature     : 'rankSelector',
        displayName : 'Rangtyp (für Rank färben) wählen',
        description : 'Verändert den Rang welcher im Galaxy View angezeigt wird',
        active      : false,
        htmlPrefix  : 'rankSelector',
        dataType    : 'ValueList',
        data        : [
          {
            key              : 'rankSelect',
            valueDescription : 'rankSelect',
            displayName      : 'Gesamt',
            inputType        : 'radio',
            value            : 'rank',
            checked          : true,
          },
          {
            key              : 'rankSelect',
            valueDescription : 'rankSelect',
            displayName      : 'Gebäude',
            inputType        : 'radio',
            value            : 'buildingRank',
            checked          : false,
          },
          {
            key              : 'rankSelect',
            valueDescription : 'rankSelect',
            displayName      : 'Forschung',
            inputType        : 'radio',
            value            : 'researchRank',
            checked          : false,
          },
          {
            key              : 'rankSelect',
            valueDescription : 'rankSelect',
            displayName      : 'Flotte',
            inputType        : 'radio',
            value            : 'fleetRank',
            checked          : false,
          },
          {
            key              : 'rankSelect',
            valueDescription : 'rankSelect',
            displayName      : 'Verteidigung',
            inputType        : 'radio',
            value            : 'defensiveRank',
            checked          : false,
          },
        ],
      },
      {
        feature     : 'generalsettings',
        displayName : 'Generelle Einstellungen',
        description : 'Einstellungen die sich nicht auf Spieler sondern das Skript ansich beziehen.',
        active      : true,
        htmlPrefix  : 'generalsettings',
        dataType    : 'ValueList',
        data        : [
          {
            key              : 'syncbutton',
            valueDescription : 'Shortcut der den Sync Button auf die e-Taste legt',
            displayName      : 'Sync shortcut auf E',
            inputType        : 'checkbox',
            value            : 'syncbutton',
            checked          : true,
          },
          {
            key              : 'debugInfo',
            valueDescription : 'Zeigt Informationen über das Script an',
            displayName      : 'Debug Infos anzeigen',
            inputType        : 'checkbox',
            value            : 'debugInfo',
            checked          : true,
          },
          {
            key              : 'debugLog',
            valueDescription : 'Zeigt Log Informationen der Module an',
            displayName      : 'Debug Log anzeigen',
            inputType        : 'checkbox',
            value            : 'debugLog',
            checked          : true,
          },
          {
            key              : 'configOpen',
            valueDescription : 'Öffnet die Config beim Start',
            displayName      : 'Config offen halten',
            inputType        : 'checkbox',
            value            : 'configOpen',
            checked          : false,
          },
        ],
      },
    ],
    userInterface: {
      title : 'Galaxy View Plus Config',
      css   : `
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
    },
  }

  static HTTP_MAX_RETRY_COUNT = 3
  // http settings for statsinterface
  static HTTP_METHOD = 'GET'
  static HTTP_REQUEST_TIMEOUT = 1000

  static HTTP_USER_AGENT = 'GalaxyViewPlus - bei Problemen -> architekt am Discord' // in ms
  static STATS_URL = 'https://pr0game.com/stats_Universe_2.json' // in hours

  // keys of all settings saved to storage
  static STORAGE_KEYS = {
    USER_CONFIG    : 'GalaxyViewPlus_Config',
    CLEANUP_STATUS : 'GalaxyViewPlus_CleanupStatus',
    UPDATE_STATUS  : 'GalaxyViewPlus_UpdateStatus',
    STATS_DATA     : 'GalaxyViewPlus_StatsData',
    DEBUG_LOG      : 'GalaxyViewPlus_DebugLog',
  }

  static STORAGE_TYPE = 'localStorage' // allowed values are localStorage or GM

  static UPDATE_INTERVAL = 6 // in hours

  static UPDATE_INTERVAL_DELAY = 2 // Minutes

  static UPDATE_INTERVAL_STARTTIME = 0 // in hours

  // properties in config.features.<property> which are user defined
  static USER_DEFINED_FEATURE_PROPERTIES = [
    'active',
    'data',
    'sortData',
  ]
}
