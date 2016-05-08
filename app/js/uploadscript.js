
  
function convertImgToBase64(url, callback, outputFormat){
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function(){
      var canvas = document.createElement('CANVAS');
      var ctx = canvas.getContext('2d');
    canvas.height = this.height;
    canvas.width = this.width;
      ctx.drawImage(this,0,0);
      var dataURL = canvas.toDataURL(outputFormat || 'image/png');
      callback(dataURL);
      canvas = null; 
  };
  img.src = url;
}


$('#img2b64').submit(function(event){
    var imageUrl = $(this).find('input[name=url]').val();
    console.log('imageUrl', imageUrl);
    convertImgToBase64(imageUrl, function(base64Img){
        $('.output')
            .find('textarea')
                .val(base64Img)
                .end()
            .find('a')
                .attr('href', base64Img)
                .text(base64Img)
                .end()
            .find('img')
                .attr('src', base64Img);
    });
    
    event.preventDefault();
});
