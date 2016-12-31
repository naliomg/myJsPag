// created by Nali
// latest revised at 2016-12-31
// 本版本不支持链式作业，主要在于方便书写js代码时可以在此摘取对于方法

;
(function(w) {
    //定义myJsPag框架对象
    var myJsPag = function() {
        this.elements = null;
    };

    //添加框架对象的属性与方法
    myJsPag.prototype = {
        /**
         * [extend 扩展对象]
         * @param  {[obj]} target [目标对象]
         * @param  {[obj]} source [拷贝兑现]
         * @return {[type]}        [description]
         */
        extend: function(target, source) {
            for (var i in source) {
                target[i] = source[i];
            }
            return target;
        }
    }

    //创建框架对象,并将其赋值给window属性
    var myJsPag = new myJsPag();
    w.myJsPag = myJsPag;


    //添加扩展属性
    /* 基础模块 */
    myJsPag.extend(myJsPag, {
        /**
         * [getClassName 获取className节点兼容版,兼容IE9以下版本]
         * @param  {[string]} str     [类名，必需]
         * @param  {[string]} tagName [标签名，非必需]
         * @param  {[elem|string]} objP    [搜索范围的父节点，非必需]
         * @return {[array]}         [description]
         */
        getClassName: function(str, tagName, objP) {
            var tagName = tagName || '*';
            if (typeof objP == 'string') {
                objP = document.getElementById(objP.substring(1));
            }
            var objP = objP || document;
            var aElm = objP.getElementsByTagName(tagName);
            var arr = [];
            for (var i = 0; i < aElm.length; i++) {
                var aClassName = aElm[i].className.split(" ");
                for (var j = 0; j < aClassName.length; j++) {
                    if (aClassName[j] == str) {
                        arr.push(aElm[i]);
                        break;
                    }
                }
            }
            return arr;
        },
        /**
         * [addClass 添加class类名，只能对单个dom添加]
         * @param {[obj]} obj [需要添加的dom节点]
         * @param {[str]} str [类名]
         */
        addClass: function(obj, str) {
            if (!obj.className || obj.className == "") {
                obj.className = str;
            } else {
                var arr = obj.className.split(" ");
                if (findStr(arr, str) == -1) {
                    obj.className += " " + str;
                }
            }

            function findStr(arr, str1) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == str1) {
                        return i;
                    }
                }
                return -1;
            }
        },
        /**
         * [removeClass 删除类名，只能单个删除]
         * @param  {[obj]} obj [需要删除类名的dom节点]
         * @param  {[str]} str [类名]
         * @return {[type]}     [description]
         */
        removeClass: function(obj, str) {
            if (obj.className != "") {
                var arr = obj.className.split(" ");
                var temp = findStr(arr, str);
                if (temp != -1) {
                    arr.splice(temp, 1);
                    obj.className = arr.join(" ");
                }
            }

            function findStr(arr, str1) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == str1) {
                        return i;
                    }
                }
                return -1;
            }
        }
    });

    /* 选择模块 */
    myJsPag.extend(myJsPag, {
        /**
         * [$id 由ID获取对象]
         * @param  {[string]} id [description]
         * @return {[DOM对象]}    [description]
         */
        $id: function(id) {
            return document.getElementById(id);
        },
        /**
         * [$tagName 获取标签对象]
         * @param  {[type]} tagName [description]
         * @return {[dom集合]}         [description]
         */
        $tagName: function(tagName, parentNode) {
            if (typeof parentNode == 'string') {
                parentNode = document.getElementById(parentNode.substring(1));
            }
            var parentNode = parentNode || document;
            return parentNode.getElementsByTagName(tagName);
        },
        /**
         * [$group 获取多个选择器对应节点]
         * @param  {[string]} str        [选择器，以逗号隔开]
         * @param  {[id|elem]} parentNode [父节点，范围节点]
         * @return {[array]}            [description]
         */
        $group: function(str, parentNode) {
            var arr = str.split(',');
            var resultArr = [];
            for (var i = 0; i < arr.length; i++) {
                var firstLetter = arr[i].charAt(0);
                var tag = arr[i].substring(1);
                if (firstLetter == '#') {
                    resultArr.push(document.getElementById(tag));
                } else if (firstLetter == '.') {
                    pushArray(resultArr, myJsPag.getClassName(tag, '*', parentNode));
                } else {
                    pushArray(resultArr, myJsPag.$tagName(arr[i], parentNode));
                }
            }
            return resultArr;

            function pushArray(resiveArr, pushedArr) {
                for (var k = 0; k < pushedArr.length; k++) {
                    resiveArr.push(pushedArr[k]);
                }
                return resiveArr;
            }
        },
        /**
         * [$domTree 依据类名、id、标签名查找dom树结构]
         * @param  {[string]} str [description]
         * @param  {[id|elem]} parentNode [父节点]
         * @return {[array]}     [description]
         */
        $domTree: function(str, parentNode) {
            var temp = str.split(' ');
            var arr = [];
            for (var i = 0; i < temp.length; i++) {
                if (temp[i] != '') {
                    arr.push(temp[i]);
                }
            }
            var resultArr = parentNode ? [parentNode] : [];
            for (var i = 0; i < arr.length; i++) {
                temp = [];
                var firstLetter = arr[i].charAt(0);
                var tag = arr[i].substring(1);

                if (firstLetter == '#') {
                    temp.push(document.getElementById(tag));
                } else if (firstLetter == '.') {
                    if (resultArr.length) {
                        for (var j = 0; j < resultArr.length; j++) {
                            pushArray(temp, myJsPag.getClassName(tag, '*', resultArr[j]));
                        }
                    } else {
                        pushArray(temp, myJsPag.getClassName(tag));
                    }
                } else {
                    if (resultArr.length) {
                        for (var j = 0; j < resultArr.length; j++) {
                            pushArray(temp, myJsPag.$tagName(arr[i], resultArr[j]));
                        }
                    } else {
                        pushArray(temp, myJsPag.$tagName(arr[i]));
                    }
                }
                resultArr = temp;
            }
            return resultArr;

            function pushArray(resiveArr, pushedArr) {
                for (var k = 0; k < pushedArr.length; k++) {
                    resiveArr.push(pushedArr[k]);
                }
                return resiveArr;
            }
        },
        /**
         * [$qsall H5选择方法querySelectorAll的封装，移动端可用]
         * @param  {[string]} selector   [description]
         * @param  {[elem]} parentNode [description]
         * @return {[dom集合]}            [description]
         */
        $qsall: function(selector, parentNode) {
            parentNode = parentNode || document;
            return parentNode.querySelectorAll(selector);
        }
    });

    /* CSS模块 */
    myJsPag.extend(myJsPag, {
        /**
         * [css css的设置和获取]
         * @param  {[elem]} elemNode [description]
         * @param  {[string|json]} key      [description]
         * @param  {[string]} value    [description]
         * @return {[type]}          [description]
         */
        css: function(elemNode, key, value) {
            if (myJsPag.isjson(arguments[1])) {
                for (var jsonkey in arguments[1]) {
                    if (elemNode.length) {
                        for (var i = 0; i < elemNode.length; i++) {
                            elemNode[i].style[jsonkey] = arguments[1][jsonkey];
                        }
                    } else {
                        elemNode.style[jsonkey] = arguments[1][jsonkey];
                    }
                }
            } else {
                if (elemNode.length) {
                    if (value) {
                        for (var i = 0; i < elemNode.length; i++) {
                            elemNode[i].style[key] = value;
                        }
                    } else {
                        return myJsPag.getStyle(elemNode[0], key);
                    }
                } else {
                    if (value) {
                        elemNode.style[key] = value;
                    } else {
                        return myJsPag.getStyle(elemNode, key);
                    }
                }
            }
        }
    });

    /* 属性模块 */
    myJsPag.extend(myJsPag, {
        /**
         * [attr 设置属性,因setsttribute只兼容到ie8,故此方法也只兼容到ie8]
         * @param  {[elem]} elemNode [description]
         * @param  {[string|json]} key      [description]
         * @param  {[string]} value    [description]
         * @return {[type]}          [description]
         */
        attr: function(elemNode, key, value) {
            if (myJsPag.isjson(arguments[1])) {
                for (var jsonkey in arguments[1]) {
                    if (elemNode.length) {
                        for (var i = 0; i < elemNode.length; i++) {
                            elemNode[i].setAttribute(jsonkey, arguments[1][jsonkey]);
                        }
                    } else {
                        elemNode.setAttribute(jsonkey, arguments[1][jsonkey]);
                    }
                }
            } else {
                if (elemNode.length) {
                    if (value) {
                        for (var i = 0; i < elemNode.length; i++) {
                            elemNode[i].setAttribute(key, value)
                        }
                    } else {
                        return elemNode[0].getAttribute(key);
                    }
                } else {
                    if (value) {
                        elemNode.setAttribute(key, value);
                    } else {
                        return elemNode.getAttribute(key);
                    }
                }
            }
        }
    });

    /* 事件模块 */
    myJsPag.extend(myJsPag, {
        /**
         * [addEvent 添加事件，兼容IE的attachEvent]
         * @param {[elem]}   obj    [需要添加事件的对象]
         * @param {[event]}   evname [事件名称]
         * @param {Function} fn     [执行函数]
         */
        addEvent: function(obj, evname, fn) {
            if (obj.addEventListener) { //非ie与ie9
                obj.addEventListener(evname, fn, false);
            } else { //ie5-8
                obj.attachEvent("on" + evname, fn);
            }
        },
        /**
         * [removeEvent 移除事件，兼容IE]
         * @param  {[ele]}   obj    [需要添加事件的对象]
         * @param  {[event]}   evname [事件名称]
         * @param  {Function} fn     [执行函数]
         * @return {[type]}          [description]
         */
        removeEvent: function(obj, evname, fn) {
            if (obj.removeEventListener) { //ie9和非ie
                obj.removeEventListener(evname, fn, false);
            } else { //ie5-8
                obj.detachEvent("on" + evname, fn);
            }
        },
        /**
         * [delegate 事件委托]
         * @param  {[elem]}   parentNode  [父节点]
         * @param  {[string]}   childNode [目标节点名]
         * @param  {[string]}   evname      [事件名]
         * @param  {Function} fn          [执行函数]
         * @return {[type]}               [description]
         */
        delegate: function(parentNode, childNode, evname, fn) {
            myJsPag.addEvent(parentNode, evname, function(ev) {
                ev = ev || window.event;
                var target = ev.target || ev.srcElement;
                if (childNode.charAt(0) == '.') {
                    if (classPd(childNode.substring(1), target)) {
                        fn.call(target);
                    }
                } else if (target.nodeName.toLowerCase() == childNode) {
                    fn.call(target);
                }
                //判断点击目标是否包含class类名
                function classPd(str, target) {
                    var aClassName = target.className.split(" ");
                    for (var i = 0; i < aClassName.length; i++) {
                        if (aClassName[i] == str) {
                            return true;
                            break;
                        }
                    }
                }
            });
        }
    });

    /* 字符串相关模块 */
    myJsPag.extend(myJsPag, {
        /**
         * [trim 删除首位字符串]
         * @param  {[string]} str [description]
         * @return {[string]}     [description]
         */
        trim: function(str) {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        },
        ltrim: function(str) {
            return str.replace(/(^\s*)/g, '');
        },
        rtrim: function(str) {
            return str.replace(/(\s*$)/g, '');
        }
    });

    /* 日期模块 */
    myJsPag.extend(myJsPag, {});

    /* 数字相关模块 */
    myJsPag.extend(myJsPag, {
        random: function(lower, upper) {
            var choices = upper - lower + 1;
            return Math.floor(Math.random() * choices) + lower;
        }
    });

    /* 本地存储模块 */
    myJsPag.extend(myJsPag, {});

    /* Cookie模块 */
    myJsPag.extend(myJsPag, {
        /**
         * [setCookie 设置cookie]
         * @param {[string]} key   [键]
         * @param {[string]} value [值]
         * @param {[number]} t     [过期时间(天)]
         */
        setCookie: function(key, value, t) {
            var oDate = new Date();
            oDate.setDate(oDate.getDate() + t);
            document.cookie = key + "=" + value + ";expires=" + oDate.toGMTString();
        },
        /**
         * [getCookie 读取cookie]
         * @param  {[string]} key [键]
         * @return {[type]}     [description]
         */
        getCookie: function(key) {
            var arr1 = document.cookie.split("; ");
            for (var i = 0; i < arr1.length; i++) {
                var arr2 = arr1[i].split("=");
                if (arr2[0] == key) {
                    return decodeURI(arr2[1]);
                }
            }
        },
        /**
         * [removeCookie 删除cookie]
         * @param  {[string]} key [键]
         * @return {[type]}     [description]
         */
        removeCookie: function(key) {
            myJsPag.setCookie(key, "", -1);
        }
    });

    /* 判断类型模块 */
    myJsPag.extend(myJsPag, {
        /**
         * [isjson 判断是不是json对象]
         * @param  {[data]} obj [description]
         * @return {[boolean]}     [description]
         */
        isjson: function(obj) {
            var flag = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
            return flag;
        },
        /**
         * [hasClass 判断dom对象有无指定class名]
         * @param  {[elem]}  obj [description]
         * @param  {[string]}  str [description]
         * @return {Boolean}     [description]
         */
        hasClass: function(obj, str) {
            if (obj.className == "") {
                return false;
            } else {
                str = myJsPag.trim(str);
                var arr = obj.className.split(" ");
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == str) {
                        return true;
                    }
                }
                return false;
            }
        }
    });

    /* 验证模块 */
    myJsPag.extend(myJsPag, {});

    /* ajax模块 */
    myJsPag.extend(myJsPag, {
        /**
         * [ajax description]
         * @param  {[json]} opt [参数设置]
         * @return {[type]}     [description]
            option设置：
            {
                method: 'GET',
                url: '1.txt',
                responseType:'xml/json',
                data: {
                   name1:'value1',
                   name2:'value2'                        
                },
                success: function (response) {
                   alert(response);
                }                
            }
         */
        ajax: function(opt) {
            opt = opt || {};
            opt.method = opt.method.toUpperCase() || 'POST';
            opt.url = opt.url || '';
            opt.async = opt.async || true;
            opt.responseType = opt.responseType || '';
            opt.data = opt.data || null;
            opt.success = opt.success || function() {};
            var xmlHttp = createXHR();
            var params = [];
            for (var key in opt.data) {
                params.push(key + '=' + opt.data[key]);
            }
            var postData = params.join('&');
            if (opt.method.toUpperCase() === 'POST') {
                xmlHttp.open(opt.method, opt.url, opt.async);
                xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
                xmlHttp.send(postData);
            } else if (opt.method.toUpperCase() === 'GET') {
                xmlHttp.open(opt.method, opt.url + '?' + postData + '&' + Math.random(), opt.async);
                xmlHttp.send(null);
            }
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    if (opt.responseType == 'json') {
                        var responseData = JSON.parse(xmlHttp.responseText);
                    } else if (opt.responseType == 'xml') {
                        var responseData = xmlHttp.responseXML;
                    } else {
                        var responseData = xmlHttp.responseText;
                    }
                    opt.success(responseData);
                }
            };

            function createXHR() {
                var xmlHttp;
                try {
                    xmlHttp = new XMLHttpRequest();
                } catch (e) {
                    try {
                        xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
                    } catch (e) {
                        try {
                            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                        } catch (e) {
                            alert("您的浏览器不支持AJAX！");
                            return false;
                        }
                    }
                }
                return xmlHttp;
            }
        }
    });

    /* event模块 */
    myJsPag.extend(myJsPag, {
        /* 获取event属性 */
        getEvent: function(e) {
            return e ? e : window.event;
        },
        /* 获取事件目标 */
        getTarget: function(e) {
            var e = myJsPag.getEvent(e);
            return e.target || e.srcElement;
        },
        /* 阻止默认行为 */
        preventDefault: function(e) {
            var e = myJsPag.getEvent(e);
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        },
        /* 阻止冒泡 */
        stopPropagation: function(e) {
            var e = myJsPag.getEvent(e);
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
        }
    });

    /* 运动模块 */
    myJsPag.extend(myJsPag, {
        /**
         * [animate 基础运动框架]
         * @param  {[elem]} obj      [单个对象，只能为单个对象]
         * @param  {[json]} styles   [运动的样式]
         * @param  {[number]} duration [运动时间毫秒]
         * @param  {[string]} easing   [事件函数]
         * @param  {[function]} endFn    [回调函数]
         * @return {[type]}          [description]
         */
        animate: function(obj, styles, duration, easing, endFn) {
            //兼容处理在外围
            //数据初始化-适配器
            var easing = easing || linear;
            var starTime = Date.now();
            var initPos = {};
            var distance = {};
            for (var key in styles) {
                if (key == 'opacity') {
                    initPos[key] = parseFloat(myJsPag.getStyle(obj, key) * 100);
                } else {
                    initPos[key] = parseFloat(myJsPag.getStyle(obj, key));
                }
                distance[key] = styles[key] - initPos[key];
            }
            //关闭停止运动开关     
            obj.stopAnimationFlag = false;

            //运动
            requestAnimationFrame(function step() {
                var p = Math.min(1.0, (Date.now() - starTime) / duration);

                //判断外部控制结束指令
                if (obj.stopAnimationFlag) {
                    cancelAnimationFrame(obj.animationStop);
                    if (obj.endAllAnimation == false && obj.toEndStyleAnimation == false) {
                        p = 1.0;
                    } else if (obj.endAllAnimation == false && obj.toEndStyleAnimation == true) {
                        p = 1.0;
                        change();
                    } else if (obj.endAllAnimation == true && obj.toEndStyleAnimation == false) {
                        p = 2.0;
                    } else {
                        p = 1.0;
                        change();
                        p = 2.0;
                    }
                } else {
                    change();
                }
                //运动结束，判断回调执行
                if (p == 1.0) {
                    endFn && endFn();
                }
                //未到终点，继续循环执行运动
                if (p < 1.0) {
                    obj.animationStop = requestAnimationFrame(step);
                }

                //属性改变赋值
                function change() {
                    for (var key in styles) {
                        if (key == 'opacity') {
                            obj.style[key] = (initPos[key] + distance[key] * timefn(easing, p)) / 100;
                            obj.style.filter = 'alpha(opacity=' + (initPos[key] + distance[key] * timefn(easing, p)) + ')';
                        } else {
                            obj.style[key] = initPos[key] + distance[key] * timefn(easing, p) + 'px';
                        }
                    }
                }
            });

            //时间运动曲线
            function timefn(easing, x) {
                if (typeof easing == 'function') {
                    return easing(x);
                }

                function bounceOut(x) {
                    var n1 = 7.5625,
                        d1 = 2.75;
                    if (x < 1 / d1) {
                        return n1 * x * x;
                    } else if (x < 2 / d1) {
                        return n1 * (x -= (1.5 / d1)) * x + .75;
                    } else if (x < 2.5 / d1) {
                        return n1 * (x -= (2.25 / d1)) * x + .9375;
                    } else {
                        return n1 * (x -= (2.625 / d1)) * x + .984375;
                    }
                }
                switch (easing) {
                    case 'linear': //匀速
                        {
                            return x;
                        }
                    case 'swing':
                        {
                            return -Math.cos(x * Math.PI) / 2 + 0.5;
                        }
                    case 'easeInQuad': //加速
                        {
                            return x * x;
                        }
                    case 'easeOutQuad': //减速
                        {
                            return 1 - (1 - x) * (1 - x);
                        }
                    case 'easeInOutQuad': //先加速，后减速
                        {
                            return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
                        }
                    case 'easeInCubic': //加速，立方
                        {
                            return x * x * x;
                        }
                    case 'easeOutCubic': //减速，立方
                        {
                            return 1 - Math.pow(1 - x, 3);
                        }
                    case 'easeInOutCubic': //加减速，立方
                        {
                            return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
                        }
                    case 'easeInSine': //
                        {
                            return 1 - Math.cos(x * Math.PI / 2);
                        }
                    case 'easeInOutBounce': //
                        {
                            return x < 0.5 ? (1 - bounceOut(1 - 2 * x)) / 2 : (1 + bounceOut(2 * x - 1)) / 2;
                        }
                    case 'easeInBounce': // 弹跳撞击
                        {
                            return 1 - bounceOut(1 - x);
                        }
                    case 'easeOutBounce':
                        return bounceOut(x);
                    case 'easeInBack': // 后退进入
                        {
                            return 2.70158 * x * x * x - 1.70158 * x * x;
                        }
                    case 'easeOutBack': // 后退结束
                        {
                            return 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);
                        }
                    case 'easeInOutBack': // 
                        {
                            return x < 0.5 ?
                                (Math.pow(2 * x, 2) * ((1.70158 * 1.525 + 1) * 2 * x - 1.70158 * 1.525)) / 2 :
                                (Math.pow(2 * x - 2, 2) * ((1.70158 * 1.525 + 1) * (x * 2 - 2) + 1.70158 * 1.525) + 2) / 2;
                        }
                }
            }
        },
        /**
         * [stop 运动停止函数]
         * @param  {[elem]} obj        [单个节点]
         * @param  {[boolean]} endAll     [是否执行回调函数]
         * @param  {[boolean]} toEndStyle [到此运动最后状态]
         * @return {[type]}            [description]
         */
        stop: function(obj, endAll, toEndStyle) {
            var endAll = endAll || false;
            var toEndStyle = toEndStyle || false;
            obj.stopAnimationFlag = true;
            obj.endAllAnimation = endAll;
            obj.toEndStyleAnimation = toEndStyle;
        }
    });

    /* 其他杂项方法 */
    myJsPag.extend(myJsPag, {
        //将伪数组转化为真数组
        realArray: function(c) {
            try {
                return Array.prototype.slice.call(c);
            } catch (e) { //ie8以下对nodeList上方法会报错
                var ret = [];
                for (var i = 0; i < c.length; i++) {
                    ret[i] = c[i];
                }
                return ret;
            }
        },
        //获取对象属性
        getStyle: function(obj, attr) {
            return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
        },
        /**
         * [tab 选项卡切换插件]
         * @param  {[elem/string]} elem [elem/#id]
         * @return {[type]}      [description]
         * html结构，样式自定义
         <div id="myJsTab">
            <ul class="myJsTabTitle">
                <li class="active">title1</li>
                <li>title2</li>
                <li>title3</li>
            </ul>
            <div class="myJsTabContent">
                <div class="active">title 1</div>
                <div>title 2</div>
                <div>title 3</div>
            </div>
        </div>
         */
        tab: function(elem) {
            if (typeof elem == 'string') {
                var elem = myJsPag.$id(elem);
            }
            var aTitle = myJsPag.getClassName('myJsTabTitle', 'ul', elem)[0].getElementsByTagName('li');
            var aContent = myJsPag.getClassName('myJsTabContent', 'div', elem)[0].getElementsByTagName('div');
            for (var i = 0; i < aTitle.length; i++) {
                aTitle[i].myJsTabList = i;
            }
            for (var i = 0; i < aTitle.length; i++) {
                myJsPag.addEvent(aTitle[i], 'click', function() {
                    for (var i = 0; i < aTitle.length; i++) {
                        myJsPag.removeClass(aTitle[i], 'active');
                        myJsPag.removeClass(aContent[i], 'active');
                    }
                    myJsPag.addClass(this, 'active');
                    myJsPag.addClass(aContent[this.myJsTabList], 'active');
                });
            }
        },
        getBrowser: function() {
            var str1 = navigator.userAgent.toLowerCase();
            if (str1.indexOf('msie') !== -1) {
                return "ie";
            } else if (str1.indexOf('chrome') !== -1) {
                return "chrome";
            } else if (str1.indexOf('safari') !== -1) {
                return "safari";
            } else if (str1.indexOf('firefox') !== -1) {
                return "firefox";
            } else {
                return "other";
            }
        }
    });

    //myJsPag基础兼容处理

    // requestAnimationFrame的兼容处理
    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
    }());
})(window);
