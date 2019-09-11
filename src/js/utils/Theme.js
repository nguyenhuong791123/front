export const THEME = {
    PATH: './dist/'
    // ,FILE: '/bootstrap.css'
    ,FILE: '/bootstrap.min.css'
    ,getTheme: (theme) => {
        return THEME.PATH + theme + THEME.FILE;
    }
    ,getThemes: () => {
        return {
            CERULEAN: 'cerulean'
            ,COSMO: 'cosmo'
            ,CYBORG: 'cyborg'
            ,DARKLY: 'darkly'
            ,FLATLY: 'flatly'
            ,JOURNAL: 'journal'
            ,LITREA: 'litera'
            ,LUMEN: 'lumen'
            ,MINTY: 'minty'
            ,PULSE: 'pulse'
            ,SNADLONE: 'sandstone'
            ,SIMPLEX: 'simplex'
            ,SKETCHY: 'sketchy'
            ,SLATE: 'slate'
            ,SOLAR: 'solar'
            ,SPACELAB: 'spacelab'
            ,SUPERHERO: 'superhero'
            ,UNITED: 'united'
            ,YETI: 'yeti'
        }
    }
}