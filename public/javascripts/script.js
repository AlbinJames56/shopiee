
      function addToCart(prodId){
        $.ajax({
          url:'/add-to-cart/'+prodId,
          method:"get",
          success:(response)=>{
            if(response.status){
                let count=$('#cart-count').html()
                count=parseInt(count)+1
                $("#cart-count").html(count)
                console.log(count);
            }
            
          },
          error: function(xhr, status, error) {
            console.error('Error:', error);
            // Handle error if needed
          }
        })
      }