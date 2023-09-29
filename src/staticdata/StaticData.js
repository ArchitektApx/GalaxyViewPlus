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
    configVersion : '1.0.8',
    features      : [
      {
        active           : true,
        dataType         : 'ValueTable',
        description      : 'Recolor the username of the user.',
        displayName      : 'Username recolor',
        feature          : 'userRecolor',
        htmlPrefix       : 'userRecolor',
        keyDefault       : 'ExampleUserName',
        keyDescription   : 'The username which should be recolored',
        keyDisplayName   : 'Username',
        keyInputType     : 'text',
        keyName          : 'Username',
        valueDefault     : '#ffa700',
        valueDescription : 'The color which should be used for the username',
        valueDisplayName : 'Color',
        valueInputType   : 'color',
        valueName        : 'Color',

        data: [
          { key: 'ExampleUserName', value: '#ffa700' },
        ],
      },
      {
        active           : true,
        dataType         : 'ValueTable',
        description      : 'Display and recolor the rank for each user in the galaxy view.',
        displayName      : 'Rank recolor',
        feature          : 'rankRecolor',
        htmlPrefix       : 'rankRecolor',
        keyDefault       : 0,
        keyDescription   : 'Recolor ranks higher than this value with the given color',
        keyDisplayName   : 'Rank',
        keyInputType     : 'number',
        keyName          : 'Rank',
        valueDefault     : '#2cba00',
        valueDescription : 'The color which should be used for the rank',
        valueDisplayName : 'Color',
        valueInputType   : 'color',
        valueName        : 'Color',

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
        description : 'Recolor inactive users',
        displayName : 'Inactive recolor',
        feature     : 'inactiveRecolor',
        htmlPrefix  : 'inactiveRecolor',

        data: [
          {
            displayName      : 'Inaktiv/Inactive (i)',
            inputType        : 'color',
            key              : 'inactiveColor',
            value            : '#f70fff',
            valueDescription : 'Inaktiv/Inactive (i)',
          },
          {
            displayName      : 'Lange/Long i (i l)',
            inputType        : 'color',
            key              : 'longInactiveColor',
            value            : '#ff00ff',
            valueDescription : 'Lange/Long i (i l)',
          },
        ],
      },
      {
        active      : true,
        dataType    : 'ValueList',
        description : 'Shows a count of near moons and planets within the near range. Needs sync data to work.',
        displayName : 'RangeInfo',
        feature     : 'rangeInfo',
        htmlPrefix  : 'rangeInfo',

        data: [
          {
            displayName      : 'Radius',
            inputType        : 'number',
            key              : 'nearRange',
            value            : 20,
            valueDescription : 'Radius in which moons and planets are counted.',
          },
          {
            displayName      : 'Min. Sys.',
            inputType        : 'number',
            key              : 'minSys',
            value            : 1,
            valueDescription : 'First system in the Galaxy.',
          },
          {
            displayName      : 'Max. Sys.',
            inputType        : 'number',
            key              : 'maxSys',
            value            : 400,
            valueDescription : 'Last system in the Galaxy.',
          },
        ],
      },
      {
        active      : false,
        dataType    : 'ValueList',
        description : 'Use different Rrank for Rank Recoloring.',
        displayName : 'Select a rank for recoloring',
        feature     : 'rankSelector',
        htmlPrefix  : 'rankSelector',

        data: [
          {
            checked          : true,
            displayName      : 'Total',
            inputType        : 'radio',
            key              : 'rankSelect',
            value            : 'rank',
            valueDescription : 'rankSelect',
          },
          {
            checked          : false,
            displayName      : 'Buildings',
            inputType        : 'radio',
            key              : 'rankSelect',
            value            : 'buildingRank',
            valueDescription : 'rankSelect',
          },
          {
            checked          : false,
            displayName      : 'Research',
            inputType        : 'radio',
            key              : 'rankSelect',
            value            : 'researchRank',
            valueDescription : 'rankSelect',
          },
          {
            checked          : false,
            displayName      : 'Fleet',
            inputType        : 'radio',
            key              : 'rankSelect',
            value            : 'fleetRank',
            valueDescription : 'rankSelect',
          },
          {
            checked          : false,
            displayName      : 'Defense',
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
        description : 'Miscellaneous settings.',
        displayName : 'Misc Settings',
        feature     : 'generalsettings',
        htmlPrefix  : 'generalsettings',

        data: [
          {
            checked          : true,
            displayName      : 'Sync Shortcut on E',
            inputType        : 'checkbox',
            key              : 'syncbutton',
            value            : 'syncbutton',
            valueDescription : 'Sync Button will be added to the e key',
          },
          {
            checked          : false,
            displayName      : 'Show Debug Infos',
            inputType        : 'checkbox',
            key              : 'debugInfo',
            value            : 'debugInfo',
            valueDescription : 'Shows Debug Infos',
          },
          {
            checked          : false,
            displayName      : 'Show Debug Log',
            inputType        : 'checkbox',
            key              : 'debugLog',
            value            : 'debugLog',
            valueDescription : 'Shows Debug Logs',
          },
          {
            checked          : false,
            displayName      : 'Keep Config Open',
            inputType        : 'checkbox',
            key              : 'configOpen',
            value            : 'configOpen',
            valueDescription : 'Keeps the config settings open',
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
    { op: 'remove', path: [ 'features', 1, 'active' ] },
    { op: 'remove', path: [ 'features', 0, 'data' ] },
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

  static STORAGE_TYPE = 'localStorage'
  static UPDATE_INTERVAL = 6 // in hours
  static UPDATE_INTERVAL_DELAY = 2 // in minutes
}
