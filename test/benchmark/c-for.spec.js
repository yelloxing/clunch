JSLitmus.test('【内置指令】c-for', function () {

    new Clunch({
        el: document.getElementById('c-for'),
        data: ['$getLoopColors', "$getRandomColors", function ($getLoopColors, $getRandomColors) {
            return {
                loopColors: $getLoopColors(7)
            };
        }],
        template: `
            <group c-for='index1 in 7'>
                <rect :x="index*10+10" :y="index1*10+10" width='10' height='10' :fill-color='loopColors[index]'
                    c-for='index in index1'>
                </rect>
            </group>`
    });

});
