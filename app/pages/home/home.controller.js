angular.module("home", [])
    .controller("homeController", function ($scope, polymath){

        $scope.backend = window._env.mathProvider;
        $scope.result = false;
        $scope.renderMap = {
            "steps": false,
            "graph": true,
            "result": false,
            "input": true,
            "examples": true,
            "retry": false
        };
        $scope.examples = [
            "15x^3 + 14x^2 - 3x - 2",
            "x^4 - 7x^3 + 17x^2 - 17x + 6",
            "12x^3 - 41x^2 - 38x + 40"
        ];
        $scope.expression = $scope.examples[0];

        $scope.loadExample = loadExample;

        /* constructor */
        function init(){
            /* debugging purposes only*/
            window.scope = $scope;

            /* setup mathjax */
            MathJax.Hub.Config({
                tex2jax: {
                    inlineMath: [['$','$'], ['\\(','\\)']],
                    processEscapes: true
                }
            });

            /* reload graph on input change */
            $scope.$watch("expression", function(){
                renderFunction($scope.expression, "#graph")
            });

            $scope.$watch("backend", function(){
              window._env.mathProvider = $scope.backend;
            })
        }

        $scope.go = function(polynomialExpression){
            var polynomial = polymath.parse(polynomialExpression);
            polymath.reduce(polynomial).then(function(output){
              $scope.$apply(function(){
                $scope.steps = output.steps;
                show("result", "retry");
                hide("examples");
                renderZeros(output.roots);
                console.log(output);
              });
            });
        };

        function renderZeros(zeros){
            var latex = [];
            zeros.forEach(function(zero){
                latex.push( toLatex(zero) );
            });
            $scope.result = latex.join("");
        }

        /**
         *
         * @param root Fraction
         * @returns {string}
         */
        function toLatex(root){
            var num = root.n;
            var den = root.d;
            var r = "\\frac{"+num+"}{"+den+"}";
            if(num === den)
                r = num;
            if(den === 1)
                r = num;
            var sign = "-";
            if(root.s < 0)
                sign = "+";
            return "(x"+sign+r+")";
        }

        function loadExample(ex){
            $scope.expression = ex;
        }


        function renderFunction(expression, selector){
            functionPlot({
                target: selector,
                data: [{
                    fn: expression,
                    sampler: 'builtIn',  // this will make function-plot use the evaluator of math.js
                    graphType: 'polyline'
                }]
            });
        }

        $scope.show = show;
        $scope.hide = hide;
        $scope.is = is;
        function show(item){
            for (var i = 0; i < arguments.length; i++) {
                $scope.renderMap[arguments[i]] = true;
            }
        }
        function hide(item){
            for (var i = 0; i < arguments.length; i++) {
                $scope.renderMap[arguments[i]] = false;
            }
        }
        function is(item){
            for(var i = 0; i < arguments.length; i++){
                if($scope.renderMap[arguments[i]] === false)
                    return false;
            }
            return true;
        }

        init();
    })