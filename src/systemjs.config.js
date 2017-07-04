System.config({
    map: {
        'app': 'app'
    },
    paths: {
        app: {
            'ng2-slider-component': 'node_modules/ng2-slider-component/',
            'ng2-slideable-directive': 'node_modules/ng2-slideable-directive/',
            'ng2-styled-directive': 'node_modules/ng2-styled-directive/',
        }
    },
    packages: {
        app: {
            'ng2-slider-component': {
                main: './ng2-slider.component.system.js',
                defaultExtension: 'system.js'
            },
            'ng2-slideable-directive': {
                main: './slideable.directive.js',
                defaultExtension: 'js'
            },
            'ng2-styled-directive': {
                main: './ng2-styled.directive.js',
                defaultExtension: 'js'
            }
        }
    }
});