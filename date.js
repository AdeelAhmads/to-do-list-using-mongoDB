//creating layouts
exports.getDate= function(){
    const today = new Date();
    var option={
        weekday:'long',
        day:'numeric',
        month:'long'

    }
    return today.toLocaleDateString('en-US',option)
}

//creating layouts
exports.getDay= function(){
    const today = new Date();
    var option={
        weekday:'long',
       

    }
    return today.toLocaleDateString('en-US',option)
}