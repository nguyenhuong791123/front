export const THEME = {
    PATH: 'dist/'
    ,FILE: '/bootstrap.css'
    // ,FILE: '/bootstrap.min.css'
    ,getTheme: (theme) => {
        return THEME.PATH + theme + THEME.FILE;
    }
    ,getThemes: () => {
        return {
            CERULEAN: 'cerulean'
            ,COSMO: 'cosmo'
            // ,CYBORG: 'cyborg'
            ,DARKLY: 'darkly'
            // ,FLATLY: 'flatly'
            ,JOURNAL: 'journal'
            // ,LITREA: 'litera'
            // ,LUMEN: 'lumen'
            // ,MINTY: 'minty'
            // ,PULSE: 'pulse'
            // ,SNADLONE: 'sandstone'
            // ,SIMPLEX: 'simplex'
            // ,SKETCHY: 'sketchy'
            // ,SLATE: 'slate'
            ,SOLAR: 'solar'
            ,SPACELAB: 'spacelab'
            ,SUPERHERO: 'superhero'
            ,UNITED: 'united'
            // ,YETI: 'yeti'
        }
    }
    ,getOptionsThemes: () => {
        return [
            { value: 'cerulean', label: 'CERULEAN', order: 0 }
            ,{ value: 'cosmo', label: 'COSMO', order: 1 }
            ,{ value: 'darkly', label: 'DARKLY', order: 2 }
            ,{ value: 'journal', label: 'JOURNAL', order: 3 }
            // ,{ value: 'lumen', label: 'LUMEN', order: 4 }
            // ,{ value: 'minty', label: 'MINTY', order: 5 }
            // ,{ value: 'pulse', label: 'PULSE', order: 6 }
            // ,{ value: 'simplex', label: 'SIMPLEX', order: 7 }
            // ,{ value: 'sketchy', label: 'SKETCHY', order: 8 }
            ,{ value: 'solar', label: 'SOLAR', order: 9 }
            ,{ value: 'spacelab', label: 'SPACELAB', order: 10 }
            ,{ value: 'superhero', label: 'SUPERHERO', order: 11 }
            ,{ value: 'united', label: 'UNITED', order: 12 }
            // ,{ value: 'yeti', label: 'YETI', order: 13 }
        ]
    }
}