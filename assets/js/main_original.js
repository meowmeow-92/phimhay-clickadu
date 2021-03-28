var toastr;
toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "2000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

var Player = function (){
    let self = this;
        this.sources;
        this.direct = 'https://i.ytimg.com/vi/CNYAcWDsW6g/maxresdefault.jpg';
        this.checkStatus;
        this.subtitle;
    this.get_params = function (name,url){
         if (!url) url = location.href;
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        return results == null ? null : results[1];
    }

    this.find_param = function(name){
        var result = null,
        tmp = [];
        var items = location.search.substr(1).split("&");
        for (var index = 0; index < items.length; index++) {
            tmp = items[index].split("=");
            if (tmp[0] === name) result = decodeURIComponent(tmp[1]);
        }
        return result;
    }

    this.setupPlayer = function(){
        let player = jwplayer("mediaplayer"),
            engine = new p2pml.hlsjs.Engine();
        player.setup({
            key: "ITWMv7t88JGzI0xPwW8I0+LveiXX9SWbfdmt0ArUSyc=",
            playbackRateControls: [0.75, 1, 1.25, 1.5, 2],
            autostart: true,
            width: "100%",
            height: "100%",
            aspectratio: "16:9",
            controls: true,
            volume: 100,
            primary: "html5",
            stretching: "uniform",
            captions: {
                color: "#eeee22",
                fontSize: 18,
                backgroundOpacity: 10,
                edgeStyle: "raised",
                fontfamily: "Arial"
            },
            logo:{
                file:"/wp-content/uploads/2020/04/logo_bilutv_newss.png",
                link:"/",
                hide:false,
                margin:"15px",
                position:"top-right"
            },
            sources: this.sources,
            tracks: this.subtitle,
            preload: "auto"
        });
        jwplayer_hls_provider.attach();
        p2pml.hlsjs.initJwPlayer(player, {
            liveSyncDurationCount: 7,
            maxBufferLength: 500,
            loader: engine.createLoaderClass()
        });
    }



    this.init = function(){
        let param = this.get_params('hash'),
        	isRefferrer = this.get_params('referrer');
        if (param !== null ) {
        	$.ajax({
	            url: "ajax.php",
	            type:'GET',
	            data : {
	                url:param
	            }, 
	            success: function(res){
	               self.sources = res.sources;
	               self.setupPlayer();
                   

	            },
	            error:function(){
 
	            }
        	});
        }
        if (isRefferrer) {
        	$("meta[name='referrer']").attr('content','default');
        }
        setTimeout(function(){
            toastr.options.timeOut = 8000;
            toastr.error('This movie is not available in your country !');
        },2000)
    }

    this.check_tool = function (){
           $(document).keydown(function(event) {
                if (event.keyCode == 123 || event.ctrlKey && event.shiftKey && event.keyCode == 73) { // Prevent F12
                    document.getElementById('mediaplayer').innerHTML = `<img src='${self.direct}' width='100%' height='auto'\/>`;
                }
            });

           let check = this.get_params("debug");
                if (!check || check != "true") {
                    if ((navigator.userAgent.indexOf("Chrome") != -1 || navigator.userAgent.indexOf("Safari") != -1 || navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("coc_coc_browser") != -1)) {
                        var checkStatus;
                        var element = new Image();
                        Object.defineProperty(element, 'id', {
                            get: function() {
                                checkStatus = 'on';
                                throw new Error("Dev tools checker")
                            }
                        });
                        setInterval(function check() {
                            checkStatus = 'off';
                            console.dir(element);
                            if (checkStatus == 'on') {
                                document.getElementById('mediaplayer').innerHTML = `<img src='${self.direct}' width='100%' height='auto'\/>`;
                            }
                        }, 1000)
                    }
                    if (navigator.userAgent.indexOf("Firefox") != -1) {
                        window.addEventListener('devtoolschange', event => {
                            if (event.detail.isOpen == !0) {
                                document.getElementById('mediaplayer').innerHTML = `<img src='${self.direct}' width='100%' height='auto'\/>`;
                            }
                        })
                    }
                    /*if (!ref.match(/^https?:\/\/([^\/]+\.)?(bilutivi\.net|phimhayplus\.org)(\/|$)/i)) {
	                    window.location.href = self.direct
	                }*/
                }
            }
    }



$(document).ready(function(){
    let player = new Player;
    player.init();
    player.check_tool();
});



