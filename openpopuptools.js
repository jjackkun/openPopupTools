function openPop ( info , callback ) {
    var tag = {} // 태그 모음
    ,   opt = {} // 옵션 모음
    ,   obj = {} // 오브젝트 모음
    ,   xhttp // AJAX 요청을 위한 변수
    ;


	(function xhttpSet () {
		if (window.XMLHttpRequest) { // 모질라, 사파리등 그외 브라우저, ...
			xhttp = new XMLHttpRequest();
		} else if (window.ActiveXObject) { // IE 8 이상
			xhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}()) ;

	(function tagSet () {
		tag.openPopWrap = null ; // 오픈팝업 최상위 태그
		tag.content = null ; // 팝업 컨텐츠 태그
		tag.description = null ; // 알림의 설명이 들어가는 태그
		tag.title = null ; // 알림의 제목이 들어가는 태그
		tag.btnsWrap = null ; // 알림의 버튼들을 담는 부모 태그
		tag.btnClose = null ; //  팝업 닫기 버튼
	}()) ;

	(function optSet () {
		opt.activeClass = 'active' ; // 활성화 CSS 클래스
		opt.defaultTitle = '알림' ;
		opt.defaultDescription = '내용이 없습니다' ;
		opt.bgClickBln = true ; 
		opt.cTop = 0 ; 
	}()) ;

	(function objSet () {
		obj.callback = callback || null ;
		// obj.url = info.url || null ;
		obj.url = null ;
		obj.info = info ;

    console.log( obj.callback ) ; 
	}()) ;

	(function initSet () {
		var elem_div = document.createElement( 'div' ) // 팝업 컨텐츠를 동적으로 받아올 태그를 생성합니다.
		,   _html ;

		_html = '<div class="content">\n' ;
		_html += '\t<h2 class="title">' + opt.defaultTitle + '</h2>\n' ;
		_html += '\t<div class="description">\n' ;
		_html += '\t' + opt.defaultDescription + '\n' ;
		_html += '</div>\n' ;
		_html += '\t<p class="btns">\n' ;
		_html += '\t\t<button type="button" data-tag="popBtn" data-type="confirm">확인</button>\n' ;
		_html += '\t\t<button type="button" data-tag="popBtn" data-type="cancel">취소</button>\n' ;
		_html += '\t</p>\n' ;
		_html += '</div>' ; // 가상 변수에 기본이 되는 팝업 마크업을 만들어줍니다.

		elem_div.innerHTML = _html ;
		elem_div.classList.add( 'openPopWrap' ) ;

		tag.openPopWrap = elem_div ;
		tag.content = tag.openPopWrap.querySelector( 'div.content' ) ;
		tag.title = tag.openPopWrap.querySelector( 'h2.title' ) ;
		tag.description = tag.openPopWrap.querySelector( 'div.description' ) ;
		tag.btnsWrap = tag.openPopWrap.querySelector( 'p.btns' ) ;
		tag.btnConfirm = tag.btnsWrap.querySelector( '[data-type=confirm]' ) ;
		tag.btnCancel = tag.btnsWrap.querySelector( '[data-type=cancel]' ) ;

		tag.btnClose = document.createElement( 'button' ) ;
		tag.btnClose.textContent = 'X' ;
		tag.btnClose.setAttribute( 'data-tag' , 'popBtn' ) ;
		tag.btnClose.setAttribute( 'data-type' , 'cancel' ) ;
		tag.btnClose.classList.add( 'popClose' ) ;
	}()) ;

	(function openSet () { // 팝업이 열리기전의 세팅제어
		// console.log( info , typeof info ) ;
		if ( document.body.querySelectorAll( 'div.openPopWrap' ).length > 0 ) return ; 

		switch( typeof info ) { // 팝업의 정보를 체크합니다.
			case 'string' : // 정보가 일반 문자열인 경우
				console.log( info ) ;
				tag.description.innerHTML = info ;
				tag.btnCancel.parentNode.removeChild( tag.btnCancel ) ;

				evtSet() ;
				openHandler() ;
				break ;

			case 'object' :
				obj.url = info.url || null ;

				if ( obj.url == null ) {
					objSet( info ) ;

					evtSet() ;
					openHandler() ;
				} else {
					xhttp.onreadystatechange = viewContents ;
					xhttp.dataType = 'script' ;
					xhttp.open( 'GET' , obj.url , true ) ;
					xhttp.send() ;
				}

				break;

			default : // 정보가 없는 경우 undefined
				// console.log( typeof info ) ;
				tag.description = 'no contents' ;
				tag.btnCancel.parentNode.removeChild( tag.btnCancel ) ;
				evtSet() ;
				openHandler() ;
			break ;
		}
	}()) ;

	(function handleSet () {
		// tag.openPopWrap.textContent = tag.description ;
	}()) ;

	function viewContents () {
		if ( xhttp.readyState === 4 && xhttp.status === 200 ) {
			var cont = xhttp.responseText ;
			tag.description.innerHTML = cont ;

			// console.log( cont ) ;
			objSet( obj.info , true ) ;

			scriptSet() ;
			evtSet() ;
			openHandler() ;
		}
	}

	function scriptSet () {
		var sc = document.createElement( 'script' )
		,   scOld = tag.description.querySelector( 'script' ) ;

		sc.classList.add( 'tmp' ) ;

		if ( scOld ) {
			sc.innerHTML = scOld.innerHTML ;
			scOld.parentNode.removeChild( scOld ) ;
		}

		tag.openPopWrap.appendChild( sc ) ;
	}

	function objSet (info , chkUrlBln ) {
		tag.title.innerHTML = info.title || opt.defaultTitle ;

		if ( !chkUrlBln ) {
			tag.description.innerHTML = info.description || opt.defaultDescription ;
		}

		if ( info.btns ) {
			tag.btnsWrap.innerHTML = '' ;

			info.btns.forEach( function ( _btn ) {
				var btn = document.createElement( 'button' ) ;
				btn.setAttribute( 'type' , 'button' ) ;
				btn.setAttribute( 'data-type' , _btn.type ) ;
				btn.setAttribute( 'data-tag' , 'popBtn' ) ;
				btn.textContent = _btn.value ;
				tag.btnsWrap.appendChild( btn ) ;
			}) ;
		}

		if ( info.btnsWrap == false ) {
			tag.btnsWrap.parentNode.removeChild( tag.btnsWrap ) ;
		}

		if ( info.bg != undefined ) {
			console.log( info.bg ) ;
			tag.openPopWrap.style.backgroundColor = 'rgba( 0,0,0,' + info.bg + ')' ;
		}

		if ( info.bodyCloser == false ) {
			opt.bgClickBln = false ;
		}

		if ( info.outsideWrap == false ) {
			tag.content.classList.add( 'none' ) ;
			tag.title.classList.add( 'none' ) ;
		}

		if ( info.btnClose == true ) {
			tag.content.appendChild( tag.btnClose ) ;
		}
	}

	function evtSet () { // 팝업 이벤트 제어
		var btns = tag.openPopWrap.querySelectorAll( 'button[data-tag=popBtn]' ) ;
		[].forEach.call( btns , function ( btn ) {
			btn.addEventListener( 'click' , btnClickHandler ) ;
		}) ;

		tag.openPopWrap.addEventListener( 'click' , function (e) {
			// console.log( opt.bgClickBln ) ;
			if ( !opt.bgClickBln ) return ;
			if ( e.currentTarget == e.target ) {
				closeHandler() ;
			}
		}) ;

		window.addEventListener( 'scroll' , scrollHandler ) ; 
		window.addEventListener( 'mousewheel' , scrollHandler ) ; 
		window.addEventListener( 'touchmove' , scrollHandler ) ; 
    }

	function scrollHandler(e) {
		e.preventDefault() ; 
		e.stopPropagation() ; 
		window.scrollTo( 0 , opt.cTop ) ; 
	}

	function btnClickHandler (e) {
		var btn = e.currentTarget // 현재 클릭된 버튼
		,   type = btn.getAttribute( 'data-type' )
		,   resultType = null // 팝업이 뜬 후 사용자가 누르는 버튼 타입
		,   rtnArr = {} // 넘겨줄 정보를 담을 배열
		;

		// console.log( type ) ;
		switch( type ) {
			case 'confirm' : // 누른 버튼이 확인일경우
				// console.log( type ) ;
				resultType = type ;
				break ;
			case 'cancel' : // 누른 버튼이 취소일 경우
				// console.log( type ) ;
				resultType = type ;
				break;
			default : // 누른버튼이 사용자 정의 버튼일 경우
				resultType = type ;
			break ;
		}

		if ( obj.callback == null ) { // 팝업이 종료된 후 넘겨줄 인자가 없을 경우 바로 닫습니다.
			closeHandler() ;
		} else { // 팝업이 종료된 후 넘져줄 인자가 있을 경우(콜백함수) 사용자에게 정보를 전달합니다.
			rtnArr = {
				type : resultType ,
				closeHandler : closeHandler ,
				elem : tag.content
			} ;
			obj.callback( rtnArr ) ;
		}
    }

	function openHandler () { // 팝업 열기 제어
		var elem = tag.content ;
		document.body.appendChild( tag.openPopWrap ) ; 

		var supportPageOffset = window.pageXOffset !== undefined
		,	isCSS1Compat = ((document.compatMode || "") === "CSS1Compat")
		,	x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft
		,	y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop
		,	borderSize = parseInt( window.getComputedStyle( elem , null ).getPropertyValue( 'border-width' ) ) ; 

		opt.cTop = y ; 

		elem.style.height = (Math.ceil(elem.offsetHeight / 2) * 2) + (borderSize*2) + "px";
		elem.style.width = (Math.ceil(elem.offsetWidth / 2) * 2) + (borderSize*2) + "px";
	}

	function closeHandler () { // 팝업 닫기 제어
		tag.openPopWrap.parentNode.removeChild( tag.openPopWrap ) ;
		window.removeEventListener( 'scroll' , scrollHandler ) ; 
		window.removeEventListener( 'mousewheel' , scrollHandler ) ; 
		window.removeEventListener( 'touchmove' , scrollHandler ) ; 
	}
}

window.addEventListener( 'load' , function () {
    // openPop() ;
    // openPop( 'yaho' ) ;
}) ;
