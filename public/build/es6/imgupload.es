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
            this.url = options.url;
            this.autoUpload  = false || options.autoUpload;
            this.dropArea = null || $(options.dropArea);
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
            this.dropArea.removeClass('active');
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
                    if(index == $(files).length -1 ){
                        //预览回调
                        self.prevImg(prevFilesSrc);
                    }
                }
            });
        }

        upload(){
            if(this.filesFilter.length == 0){
                alert('请先选择需要上传的文件！');
                return
            }
            let self = this;
            let formData = new FormData();
            $(this.filesFilter).each(function(index,item){
                formData.append('file'+index,item)
            });
            $.ajax({
                xhr: function(){
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress" , function(e){
                        self.progress(e);
                    }, false);
                    return xhr;
                },
                url : this.url,
                type : 'POST',
                data : formData,
                processData: false,
                contentType: false,
                success : function(msg){
                    self.filesFilter.length = 0;
                    self.compeleted(msg);
                }
            });
        }

        dragEnter(){
            this.dropArea.addClass('active');
        }

        dragLeave(){
            this.dropArea.removeClass('active');
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
            if (this.dropArea) {
                this.dropArea.on("dragenter", $.proxy(this.dragEnter,this));
                this.dropArea.on("dragleave", $.proxy(this.dragLeave,this));
                this.dropArea.on("drop", $.proxy(this.fileAdded,this));
            }

            //阻止浏览器默认行。
            $(document).on({
                dragleave:function(e){e.preventDefault();},
                drop:function(e){ e.preventDefault();},
                dragenter:function(e){ e.preventDefault();},
                dragover:function(e){e.preventDefault();}
            });
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



$('#upBtn').imgupload({
    upButton : '#up', //上传按钮
    dropArea : '#drop', //拖拽敏感区域
    url : '/upload', //post地址
    autoUpload : false, //是否自动上传
    prevImg : function(imgs){ //预览图片
        var _imgs = '';
        $(imgs).each(function(index,item){
            _imgs += '<img width="100" height="100" src="'+ item +'">';
        });
        $('#prev').append(_imgs);

    },
    filter : function(files){ //过滤文件

    },
    progress : function(evt){ //上传进度
        if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            if($('#up').next('.num').length){
                $('#up').next('.num').html(Math.floor(percentComplete*100)+'%');
            }else{
                $('#up').after('<span class="num">'+ Math.floor(percentComplete*100) + '%</span>');
            }
        }
    },
    compeleted : function(msg){ //上完完毕
        if(msg.code == 'ok'){
            $('#prev').html('');
            $('#up').next('.num').html('上传完毕！');
            setTimeout(function(){
                $('#up').next('.num').fadeOut(300);
            },1000);
        }
    }
});





