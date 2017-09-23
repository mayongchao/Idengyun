(function(){
    var width = document.documentElement.clientWidth/16;
    var styleN = document.createElement('style');
    styleN.innerHTML = 'html{font-size:'+ width +'px !important;}'
    document.head.appendChild(styleN);
})();