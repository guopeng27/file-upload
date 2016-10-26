/**
 * Created by Administrator on 2016/10/25.
 */


!function($){
    class ImgUpload{
        constructor(element,options){
            this.element = element;
            this.setOptions(options)
        }
        setOptions(options){
            this.upButton = $(options.upButton);
            this.prevImg = options.prevImg;
            this.url = options.url;
            this.autoUpload  = false || options.autoUpload;
            this.dragDrop = null || $(options.dragDrop);
            this.filesFilter = [];

            this.filter = options.filter || function(){};
            this.prevImg = options.prevImg || function(){};
            this.progress = options.progress || function(){};
            this.compeleted = options.compeleted || function(){};


            this.init();
        }

        fileAdded (e){
            let self = this;
            e.stopPropagation()
            e.preventDefault();
            let files = e.target.files || e.originalEvent.dataTransfer.files;
            let prevFilesSrc = [];
            $(files).each(function(index,file){
                //上传文件添加至队列
                self.filesFilter.push(file);
                //预览图队列
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    prevFilesSrc.push(e.target.result);
                }
            });
            this.prevImg(prevFilesSrc);
        }

        upload(){
            $.ajax({
                xhr: function(){
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress" , function(e){
                        this.progress(e);
                    }, false);
                    return xhr;
                },
                url : this.url,
                type : 'POST',
                data : formData,
                processData: false,
                contentType: false,
                success : this.compeleted
            });
        }

        init(){
            //初始化事件

            //fileInput
            this.element.on('change',$.proxy(this.fileAdded,this));

            //上传
            if(this.upButton && this.autoUpload == false){
                this.upButton.on('click',$.proxy(this.upload,this));
            }

            //拖拽
            if (this.dragDrop) {
                this.dragDrop.on("drop", $.proxy(this.fileAdded,this));
            }
        }
    }

    $.fn.imgupload = function(options,cb) {
        this.each(function(){
            var el = $(this);
            if(el.data('imgupload')){
                el.data('imgupload').remove()
            }
            el.data('imgupload', new ImgUpload(el, options, cb));
        })
        return this
    }
}($);






$(function(){
    //阻止浏览器默认行。
    $(document).on({
        dragleave:function(e){    //拖离
            e.preventDefault();
        },
        drop:function(e){  //拖后放
            e.preventDefault();
        },
        dragenter:function(e){    //拖进
            e.preventDefault();
        },
        dragover:function(e){    //拖来拖去
            e.preventDefault();
        }
    });
});
$('#upBtn').imgupload({
    upButton : '#up', //上传按钮
    url : '/upload', //post地址
    dragDrop : '#drop', //拖拽敏感区域
    autoUpload : false, //是否自动上传
    prevImg : function(imgs){ //预览图片
        console.log(imgs)
    },
    filter : function(files){ //过滤文件

    },
    progress : function(evt){ //上传进度
        if (evt.lengthComputable) {
            var timer;
            var percentComplete = evt.loaded / evt.total;
            $('#progressBar').show();
            $('#progressBar .inner').animate({width:percentComplete*100+'%'},function(){
                if(percentComplete == 1 ){
                    $('#progressBar').fadeOut();
                    clearInterval(timer)
                    $('#progressBar .num').html(percentComplete*100+'%');
                }
            });
            timer = setInterval(function(){
                if(parseInt($('#progressBar .num').html()) == Math.floor(percentComplete*100)){
                    clearInterval(timer)
                }else{
                    $('#progressBar .num').html(parseInt($('#progressBar .num').html())+1+'%');
                }
            },60)

        }
    },
    compeleted : function(msg){ //上完完毕
        console.log(msg)
    }
});

