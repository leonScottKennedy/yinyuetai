function tolayout(){
	var wrap = document.querySelector(".swipe");	// ul的外框
	var list = document.querySelector(".swipe-wrap");	// ul
	var wrapW = wrap.clientWidth;		// 当前屏幕宽度 = 外框的宽
	list.innerHTML += list.innerHTML;	// 复制ul里的内容
	var lis = list.children;	// li
	list.style.width = wrapW * lis.length + "px";	// 设置ul总宽度
	for(var i = 0; i < lis.length; i++){
		lis[i].style.width =  wrapW + "px"	// 设置li的宽度
	}
}

window.onload = function() {

	var w = document.querySelector("html").getBoundingClientRect().width;

	// main
	var main = document.querySelector("#main"); 
	window.scroll = new MScroll(
		{
			element: main,
			dir: "y",
			showBar: true
		}
	); 

	// navBar
	var nav = document.querySelector("#navBar"); 
	var ul = nav.querySelector("ul");
	var li = nav.querySelectorAll("li");

	ul.style.width = ul.scrollWidth + "px";
	var navScroll = new MScroll(
		{
			element: nav,
			dir: "x",
			showBar: false
		}
	);

	for(var i=0; i<li.length; i++){
		var liTouch = new MTouch(li[i]);
		bindTap(liTouch);
	}

	function bindTap(obj){
		obj.tap(function(){
			for(var i=0; i<li.length; i++){
				li[i].children[0].className = "";
			}
			this.children[0].className = "selected";
		});
	}

	// tab
	tolayout();		// 复制ul里的内容，并设置好ul和li宽度

	var tab = document.querySelector("#focus_wrapper");	// 外框
	var tabUl = document.querySelector(".swipe-wrap");	// ul
	var tabLi = tabUl.querySelectorAll("li");			// tabLi
	var navLi = document.querySelector("#position").querySelectorAll("li");	// navLi
	var navs = navLi.length;	// 10
	var tabs = tabLi.length;	// 20

	var startP = 0;				// 每次按下手指的位置
	var startList = 0;			// ul的left值
	var translateX = 0;			// ul的left值
	var wrapW = w;
	var now = 0;				// 当前图片是第几张
	var timer = 0;

	tab.addEventListener(
		"touchstart",
		function(e){
			clearInterval(timer);
			// 判断图片该有的位置
			if(now == 0){
				now = navs;
				translateX = -now*wrapW;
				tabUl.style.WebkitTransform=tabUl.style.transform = "translateX("+translateX+"px) translateZ(0px)";
			}
			if(now == navs*2-1){
				now = navs-1;
				translateX = -now*wrapW;
				tabUl.style.WebkitTransform=tabUl.style.transform = "translateX("+translateX+"px) translateZ(0px)";
			}
			// 每次按下手指时清掉动画，抬起后再执行
			tabUl.style.transition = "0s";	
			startP = e.changedTouches[0].pageX;
			startList = translateX;
		},
		false
	)

	tab.addEventListener(
		"touchmove",
		function(e){
			var nowP = e.changedTouches[0].pageX;
			var dis = nowP - startP;
			translateX = dis + startList;
			tabUl.style.WebkitTransform=tabUl.style.transform = "translateX("+translateX+"px) translateZ(0px)";
		},
		false
	)

	tab.addEventListener(
		"touchend",
		function(e){
			now = -Math.round(translateX/wrapW);
			translateX = -now * wrapW;
			tabUl.style.transition = ".3s";
			tabUl.style.WebkitTransform=tabUl.style.transform = "translateX("+translateX+"px) translateZ(0px)";
			for(var i = 0; i < navs; i++) {
				navLi[i].className = "";
			}
			navLi[now%navs].className = "cur";
			timer = setInterval(autoplay, 3000);
		},
		false
	);

	timer = setInterval(autoplay, 3000);

	function autoplay(){
		// 不能让now无限制的++，如果now==19，就让now=9
		// 因为有动画，所以我们需要先清动画，再让now=9
		if(now == navs*2-1){
			tabUl.style.transition = "0s";
			// 每次重新计算列now之后，都要重新设置translateX
			now = navs-1;
			translateX = -now * wrapW;
			tabUl.style.WebkitTransform=tabUl.style.transform = "translateX("+translateX+"px) translateZ(0px)";
		}
		// 每次重新计算列now之后，都要重新设置translateX
		// 因为上面的transition动画很快，所以下面给了30ms延迟
		// 好让上面的动画在30ms延迟中完成，然后再接着走下面的动画
		now++;
		setTimeout(
			function(){
				translateX = -now * wrapW;
				tabUl.style.transition = ".3s";
				tabUl.style.WebkitTransform=tabUl.style.transform = "translateX("+translateX+"px) translateZ(0px)";
				for(var i = 0; i < navs; i++) {
					navLi[i].className = "";
				}
				navLi[now%navs].className = "cur";
			},
			30
		)
	};


	// tap_menu
	var channel_btn = document.querySelector(".channel_btn");
	var channel_pannel = document.querySelector(".channel_pannel");
	var tap_btn = new MTouch(channel_btn);

	tap_btn.tap(function(){
		if(channel_btn.className == "channel_btn on"){
			channel_pannel.style.display = "block";
			channel_btn.className = "channel_btn off";
		}else{
			channel_pannel.style.display = "none";
			channel_btn.className = "channel_btn on";
		}
	});
}

