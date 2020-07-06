
        const slider = document.querySelector('.slider');
        const slides = document.querySelectorAll('.card');
        const prev = document.querySelector('.prev');
        const next = document.querySelector('.next');
        const calcBtn = document.querySelector("#calculate");
        const nextArrow = document.querySelector('.btn-next');
        const prevArrow = document.querySelector('.btn-prev');
        const arrowUpText = document.querySelector('.arrow-up-text');
        const arrowDownText = document.querySelector('.arrow-down-text');
        const indicator=document.querySelector(".indicator");
        let counter = 0;
        let index = 0;

        function thousands_separators(num){
            var num_parts = num.toString().split(".");
            num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return num_parts.join(".");
        }

        calcBtn.addEventListener('click', function(){
            var user_revenue = document.querySelector("#revenueInput1").value;
            var user_profit = document.querySelector("#profitInput1").value;
            var user_salary = document.querySelector("#salaryInput1").value;
            
            if (user_profit && user_salary !== "" && user_profit && user_salary !== 0) {
                next.classList.add('active');

                indicator.classList.add("active");
                if(indicator.children.length == 0){
                    circleIndicator();
                }

                parseInt(user_revenue);
                parseInt(user_profit);
                parseInt(user_salary);
            
                var sale_price = (parseInt(user_profit) + parseInt(user_salary)) * 3;
                sale_price = Math.round(sale_price);
                document.querySelector("#sale_price").innerHTML = '$' + thousands_separators(sale_price);
                    
                var be_sale_price = sale_price;
                be_sale_price = Math.round(be_sale_price);
                var be_legal_costs = sale_price * 0.02;
                be_legal_costs = Math.round(be_legal_costs);
                var be_accnt_costs = sale_price * 0.01;
                be_accnt_costs = Math.round(be_accnt_costs);
                var be_broker_costs = sale_price * 0.12 + 5000;
                be_broker_costs = Math.round(be_broker_costs);
                var be_other_costs = sale_price * 0.025;
                be_other_costs = Math.round(be_other_costs);
                var be_total_costs = be_legal_costs + be_accnt_costs + be_broker_costs + be_other_costs;
                be_total_costs = Math.round(be_total_costs);
                var be_cash_at_close = sale_price - be_total_costs;
                be_cash_at_close = Math.round(be_cash_at_close);
                var be_income_tax = be_cash_at_close * 0.35;
                be_income_tax = Math.round(be_income_tax);
                var be_take_home_cash = be_cash_at_close - be_income_tax;
                be_take_home_cash = Math.round(be_take_home_cash);

                document.querySelector("#sm-be_legal_costs").innerHTML = '$' + thousands_separators(be_legal_costs);
                document.querySelector("#sm-be_accnt_costs").innerHTML = '$' + thousands_separators(be_accnt_costs);
                document.querySelector("#sm-be_broker_costs").innerHTML = '$' + thousands_separators(be_broker_costs);
                document.querySelector("#sm-be_other_costs").innerHTML = '$' + thousands_separators(be_other_costs);

                document.querySelector("#be_sale_price").innerHTML = '$' + thousands_separators(be_sale_price);
                document.querySelector("#be_legal_costs").innerHTML = '$' + thousands_separators(be_legal_costs);
                document.querySelector("#be_accnt_costs").innerHTML = '$' + thousands_separators(be_accnt_costs);
                document.querySelector("#be_broker_costs").innerHTML = '$' + thousands_separators(be_broker_costs);
                document.querySelector("#be_other_costs").innerHTML = '$' + thousands_separators(be_other_costs);
                document.querySelector("#be_total_costs").innerHTML = '$' + thousands_separators(be_total_costs);
                document.querySelector("#be_cash_at_close").innerHTML = '$' + thousands_separators(be_cash_at_close);
                document.querySelector("#be_income_tax").innerHTML = '$' + thousands_separators(be_income_tax);
                document.querySelector("#be_take_home_cash").innerHTML = '$' + thousands_separators(be_take_home_cash);

                var af_sale_price = sale_price * 1.5;
                af_sale_price = Math.round(af_sale_price);
                var af_legal_costs = af_sale_price * 0.01;
                af_legal_costs = Math.round(af_legal_costs);
                var af_accnt_costs = be_accnt_costs;
                af_accnt_costs = Math.round(af_accnt_costs);
                var af_broker_costs = 0;
                af_broker_costs = Math.round(af_broker_costs);
                var af_other_costs = be_other_costs;
                af_other_costs = Math.round(af_other_costs);
                var af_total_costs = af_legal_costs + af_accnt_costs + af_broker_costs + af_other_costs;
                af_total_costs = Math.round(af_total_costs);
                var af_cash_at_close = af_sale_price - af_total_costs;
                af_cash_at_close = Math.round(af_cash_at_close);
                var af_income_tax = 0;
                af_income_tax = Math.round(af_income_tax);
                var af_take_home_cash = af_cash_at_close - af_income_tax;
                af_take_home_cash = Math.round(af_take_home_cash);

                document.querySelector("#af_sale_price").innerHTML = '$' + thousands_separators(af_sale_price);
                document.querySelector("#af_legal_costs").innerHTML = '$' + thousands_separators(af_legal_costs);
                document.querySelector("#af_accnt_costs").innerHTML = '$' + thousands_separators(af_accnt_costs);
                document.querySelector("#af_broker_costs").innerHTML = '$' + thousands_separators(af_broker_costs);
                document.querySelector("#af_other_costs").innerHTML = '$' + thousands_separators(af_other_costs);
                document.querySelector("#af_total_costs").innerHTML = '$' + thousands_separators(af_total_costs);
                document.querySelector("#af_cash_at_close").innerHTML = '$' + thousands_separators(af_cash_at_close);
                document.querySelector("#af_income_tax").innerHTML = '$' + thousands_separators(af_income_tax);
                document.querySelector("#af_take_home_cash").innerHTML = '$' + thousands_separators(af_take_home_cash);
                
                document.querySelector("#sm-af_legal_costs").innerHTML = '$' + thousands_separators(be_legal_costs);
                document.querySelector("#sm-af_accnt_costs").innerHTML = '$' + thousands_separators(be_accnt_costs);
                document.querySelector("#sm-af_broker_costs").innerHTML = '$' + thousands_separators(be_broker_costs);
                document.querySelector("#sm-af_other_costs").innerHTML = '$' + thousands_separators(be_other_costs);

                var up_sale_price = af_sale_price - sale_price;
                var drop_costs = be_total_costs - af_total_costs;
                var boost_sale_price = af_sale_price;

                document.querySelector("#up_sale_price").innerHTML = '$' + thousands_separators(up_sale_price);
                document.querySelector("#drop_costs").innerHTML = '$' + thousands_separators(drop_costs);
                document.querySelector("#boost_sale_price").innerHTML = '$' + thousands_separators(boost_sale_price);

                var capture = af_take_home_cash;
                document.querySelector("#capture").innerHTML = '$' + thousands_separators(capture);

            } else {
                alert("Kindly fill all the boxes!");
            }
        });

        function circleIndicator(){
            for(let i=0; i< slides.length; i++){
                const div=document.createElement("div");
                    div.setAttribute("onclick","indicateSlide(this)")
                    div.id=i;
                    if(i==0){
                        div.className="active";
                    }
                indicator.appendChild(div);
            }
        }

        function indicateSlide(element){
            index=element.id;
            parseInt(index);
            changeSlide();
            updateCircleIndicator();

            if(index == 0){
                next.classList.add("active");
                prev.classList.remove('active');
                arrowUpText.classList.add('active');
                arrowDownText.classList.add('active');
            }

            if(index == slides.length-1) {
                next.classList.remove('active');
            }

            if(index == 1 || index == 2) {
                next.classList.add("active");
                prev.classList.add('active');
                arrowUpText.classList.remove('active');
                arrowDownText.classList.remove('active');
            }
        }
        
        function updateCircleIndicator(){
            for(let i=0; i<indicator.children.length; i++){
                indicator.children[i].classList.remove("active");
            }
            indicator.children[index].classList.add("active");
        }

        next.addEventListener('click', function(){
            nextSlide();
            if(slides[3].classList.contains('active')){
                next.classList.remove('active');
            }

            if(slides[1].classList.contains('active')){
                arrowUpText.classList.remove('active');
                arrowDownText.classList.remove('active');
            }

            updateCircleIndicator();
        });

        prev.addEventListener('click', function(){
            prevSlide();
            if(slides[0].classList.contains('active')) {
                prev.classList.remove('active');
            } else {
                prev.classList.add('active');
            }

            if(slides[0].classList.contains('active')){
                arrowUpText.classList.add('active');
                arrowDownText.classList.add('active');
            }
            updateCircleIndicator();
        });

        function prevSlide() {
            if(index !== 0){
                index--;
                prev.classList.add('active');
                next.classList.add('active');
            }else {
                prev.classList.remove('active');
            }

            changeSlide();
        }
        
        function nextSlide() {
            if(index !== slides.length){
                index++;
                next.classList.add('active');
                prev.classList.add('active');
            }else {
                next.classList.remove('active');
            }

            changeSlide();
        }

        function changeSlide() {
            for(i=0; i<slides.length; i++){
                slides[i].classList.remove('active');                
            }

            slides[index].classList.add('active');
        }