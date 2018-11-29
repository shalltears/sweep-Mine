//1.点开始生成带有10个雷的81个方块
var sweepMine = {
    mineNum: 'start',//雷的位置
    main: [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]],
    map: document.getElementsByClassName('main')[0],
    cout: 0,
    init: function () {//初始化
        var start = document.getElementsByClassName('start')[0];
        start.innerHTML = '<i class="fa fa-smile-o" aria-hidden="true"></i>';
        this.setMine();
        this.setAround();
        this.setCage();
        this.click();
        this.timer();
    },
    setMine: function () {//创建地雷
        while (this.disArr(this.mineNum).length != 11) {//如果不重复的没有十个就要继续生成，11是因为前面加了个起始字符
            var num1 = parseInt(Math.random() * 9);
            var num2 = parseInt(Math.random() * 9);
            this.mineNum += '_' + num1 + ',' + num2;
            this.main[num1][num2] = 999;
        };
    },
    click: function () {
        var li = document.getElementsByTagName('li');
        for (var i = 0; i < 81; i++) {
            (function (i) {
                li[i].onclick = function () {//绑定每个li的点击事件
                    parseInt(this.getAttribute('class').substring(3)) == 999 ? sweepMine.fail() : sweepMine.goOn(li, i);
                    this.style.backgroundColor = 'gray';
                    this.setAttribute('data', '1');
                    sweepMine.cont = 0;
                    for (var x = 0; x < 81; x++) {
                        try {
                            if (li[x].getAttribute('data') == 1 && li[x].getAttribute('class').substring(3) != 999) {
                                sweepMine.cont++;
                            }
                        }
                        catch{ }
                    }
                    if (sweepMine.cont == 71) {
                        sweepMine.win();
                    }
                }
            }(i))
        }
        for (var j = 0; j < 81; j++) {
            (function (j) {
                li[j].oncontextmenu = function () {//绑定每个li的右键事件
                    if (li[j].innerHTML == '') {
                        li[j].innerHTML = '<i class="fa fa-flag" aria-hidden="true"></i>';
                        var mineText = document.getElementsByTagName('p')[0];
                        mineText.innerHTML -= 1;
                    }
                    else {
                        li[j].innerHTML = '';
                        var mineText = document.getElementsByTagName('p')[0];
                        mineText.innerHTML = parseInt(mineText.innerHTML) + 1;
                    }
                    li[j].style.color = 'black';
                }
            }(j))
        }
        var start = document.getElementsByClassName('start')[0];
        start.onclick = function () {//开始按钮的事件
            sweepMine.map.innerHTML = '';
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    sweepMine.main[i][j] = 0;
                }
            }
            sweepMine.mineNum = 'start';
            clearInterval(timer1);
            try { clearInterval(timer2); } catch{ }
            document.getElementsByTagName('p')[0].innerHTML = '10';
            document.getElementsByTagName('p')[1].innerHTML = '0';
            sweepMine.init();
        }
        document.oncontextmenu = function (e) {//清除页面右键菜单
            return false;
        }
    },
    timer: function () {
        timer1 = setInterval(function () {
            var timeText = document.getElementsByTagName('p')[1];
            timeText.innerHTML = parseInt(timeText.innerHTML) + 1;
        }, 1000)
    },
    setAround: function () {//增加雷附近的数字
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                var cont = 0;
                if (this.main[i][j] == 999) { continue; }
                try { this.main[i - 1][j - 1] == 999 ? cont++ : 0 } catch{ }
                try { this.main[i - 1][j] == 999 ? cont++ : 0 } catch{ }
                try { this.main[i - 1][j + 1] == 999 ? cont++ : 0 } catch{ }
                try { this.main[i][j - 1] == 999 ? cont++ : 0 } catch{ }
                try { this.main[i][j + 1] == 999 ? cont++ : 0 } catch{ }
                try { this.main[i + 1][j - 1] == 999 ? cont++ : 0 } catch{ }
                try { this.main[i + 1][j] == 999 ? cont++ : 0 } catch{ }
                try { this.main[i + 1][j + 1] == 999 ? cont++ : 0 } catch{ }
                this.main[i][j] = cont;
            }
        }
    },
    setCage: function () {//创建方格与增加对应的类
        for (var i = 0; i < 9; i++) {
            var ul = document.createElement('ul');
            for (var j = 0; j < 9; j++) {
                var li = document.createElement('li');
                switch (this.main[i][j]) {
                    case 0: li.setAttribute('class', 'li-0'); break;
                    case 1: li.setAttribute('class', 'li-1'); break;
                    case 2: li.setAttribute('class', 'li-2'); break;
                    case 3: li.setAttribute('class', 'li-3'); break;
                    case 4: li.setAttribute('class', 'li-4'); break;
                    case 5: li.setAttribute('class', 'li-5'); break;
                    case 6: li.setAttribute('class', 'li-6'); break;
                    case 999: li.setAttribute('class', 'li-999'); break;
                }
                ul.appendChild(li);
            }
            this.map.appendChild(ul);
        }
    },
    goOn: function (li, i) {//递归实现展开功能
        if (li[i].getAttribute('class').substring(3) != 0) {
            li[i].innerHTML = parseInt(li[i].getAttribute('class').substring(3))
        }
        else {
            try {//边界判读
                var state = li[i].getAttribute('data');
                if (state == 1) {//标志位极大的优化了扩展时间
                    return;
                }
                if (i == 9 || i == 18 || i == 27 || i == 36 || i == 45 || i == 54 || i == 63) {
                    li[i + 1].click();
                    li[i - 9].click();
                    li[i + 9].click();
                } else if (i == 17 || i == 26 || i == 35 || i == 44 || i == 53 || i == 62 || i == 71) {
                    li[i - 1].click();
                    li[i - 9].click();
                    li[i + 9].click();
                } else if (i == 1 || i == 2 || i == 3 || i == 4 || i == 6 || i == 6 || i == 7) {
                    li[i - 1].click();
                    li[i + 1].click();
                    li[i + 9].click();
                } else if (i == 73 || i == 74 || i == 75 || i == 76 || i == 77 || i == 78 || i == 79) {
                    li[i - 1].click();
                    li[i + 1].click();
                    li[i - 9].click();
                    li[i + 9].click();
                }
                else if (i == 0) {
                    li[i + 1].click();
                    li[i + 9].click();
                }
                else if (i == 8) {
                    li[i - 1].click();
                    li[i + 9].click();
                }
                else if (i == 72) {
                    li[i + 1].click();
                    li[i - 9].click();
                }
                else if (i == 80) {
                    li[i - 1].click();
                    li[i - 9].click();
                }
                else {
                    li[i - 1].click();
                    li[i + 1].click();
                    li[i - 9].click();
                    li[i + 9].click();
                }
            }
            catch{ }
        }
    },
    winCont: 0,
    win: function () {//成功后执行
        timer2 = setInterval(function () {
            var li = document.getElementsByTagName('li');
            var color = '#' + Math.floor(Math.random() * 100).toString(10) + Math.floor(Math.random() * 100).toString(10) + Math.floor(Math.random() * 100).toString(10);
            li[sweepMine.winCont].style.backgroundColor = color;
            li[sweepMine.winCont].style.color = color;
            sweepMine.winCont++;
            if (sweepMine.winCont == 81) {
                sweepMine.winCont = 0;
            }
        }, 10);
        clearInterval(timer1);
    },
    fail: function () {//失败后执行
        var li = document.getElementsByTagName('li');
        for (var i = 0; i < 81; i++) {
            if (parseInt(li[i].getAttribute('class').substring(3)) == 999) {
                li[i].innerHTML = '<i class="fa fa-bomb" aria-hidden="true"></i>';
                li[i].style.backgroundColor = 'gray';
            }
            li[i].onclick = function(){};
            clearInterval(timer1);
        }
        var start = document.getElementsByClassName('start')[0];
        start.innerHTML = '<i class="fa fa-thumbs-o-down" aria-hidden="true"></i>';
    },
    disArr: function (str) {//字符串去重
        var obj = {};
        var sum = [];
        var arr = str.split('_');
        for (i = 0; i < arr.length; i++) {
            if (obj[arr[i]] == undefined) {
                obj[arr[i]] = 'seat';
            }
        }
        for (var pop in obj) {
            sum.push(pop.split(''));
        }
        return sum;
    }
}
sweepMine.init();