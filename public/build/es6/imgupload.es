/**
 * Created by Administrator on 2016/10/25.
 */

let filesFilter = [];
let _html = '';
$('#upBtn').change(function(e){
    //e.dataTransfer.files
    let files = e.target.files;
    filesFilter.push(files);
    for(let i = 0;i<files.length;i++){
        let reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = function (e) {
            _html += '<img width="100" height="100" src="'+ e.target.result +'" />';
            $('#preView').html(_html)
        }

    }

});
$('#up').click(function(){
    var formData = new FormData();
    $(filesFilter).each(function(index1,fileList){
        if(fileList.length > 1 ){
            $(fileList).each(function(index2,file){
                formData.append("file"+index1+index2, file);
            });
        }else{
            formData.append("file"+index1, fileList[0]);
        }
    });
    $.ajax({
        url : '/upload',
        type : 'POST',
        data : formData,
        cache: false,
        processData: false,
        contentType: false,
        success : function(msg) {
            console.log(msg)
        },
        error : function(responseStr) {

        }
    });
});