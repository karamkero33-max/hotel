
    let budgets = { 1: 100, 2: 100 };
    let teams = { 1: [], 2: [] };
    let currentPlayer = null;
    let activePlayer = 1;
    let hasDrawnCardThisTurn = false;
    let hasRevealedPlayerThisTurn = false;

    function updateTurnUI() {
        const turnBanner = document.getElementById("turn-banner");
        if (activePlayer === 1) {
            turnBanner.className = "turn-banner p1-turn";
            turnBanner.innerHTML = "دور اللاعب الأول: ابدأ بسحب لاعب عشوائي 🎲 وإجراء المزاد";
        } else {
            turnBanner.className = "turn-banner p2-turn";
            turnBanner.innerHTML = "دور اللاعب الثاني: ابدأ بسحب لاعب عشوائي 🎲 وإجراء المزاد";
        }
        document.getElementById("budget_1").textContent = budgets[1];
        document.getElementById("budget_2").textContent = budgets[2];
    }
    
    // Initial UI Setup call
    setTimeout(updateTurnUI, 100);

    // المجموعات مقسمة بوضوح لضمان فرز مركز تلو الآخر
    let pool_goalkeepers = [
        { name: "مهدي سليمان", team: "الزمالك", pos: "حارس مرمى" },
        { name: "محمد الشناوي", team: "الأهلي", pos: "حارس مرمى" }
    ];

    let pool_defenders = [
        { name: "محمود حمدي الونش", team: "الزمالك", pos: "مدافع" },
        { name: "حسام عبد المجيد", team: "الزمالك", pos: "مدافع" },
        { name: "محمود بنتايج", team: "الزمالك", pos: "مدافع" },
        { name: "محمد هاني", team: "الأهلي", pos: "مدافع" },
        { name: "ياسر إبراهيم", team: "الأهلي", pos: "مدافع" },
        { name: "ياسين مرعي", team: "الأهلي", pos: "مدافع" }
    ];

    let pool_midfielders = [
        { name: "محمد إبراهيم", team: "الزمالك", pos: "خط وسط" },
        { name: "محمد شحاتة", team: "الزمالك", pos: "خط وسط" },
        { name: "عبد الله السعيد", team: "الزمالك", pos: "خط وسط" },
        { name: "آدم كايد", team: "الزمالك", pos: "خط وسط" },
        { name: "أحمد نبيل كوكا", team: "الأهلي", pos: "خط وسط" },
        { name: "مروان عطية", team: "الأهلي", pos: "خط وسط" },
        { name: "إمام عاشور", team: "الأهلي", pos: "خط وسط" },
        { name: "محمد علي بن رمضان", team: "الأهلي", pos: "خط وسط" }
    ];

    let pool_attackers = [
        { name: "خوان بيزيرا", team: "الزمالك", pos: "مهاجم" },
        { name: "ناصر منسي", team: "الزمالك", pos: "مهاجم" },
        { name: "عدي الدباغ", team: "الزمالك", pos: "مهاجم" },
        { name: "أحمد سيد زيزو", team: "الأهلي", pos: "جناح/مهاجم" },
        { name: "محمود حسن تريزيجيه", team: "الأهلي", pos: "جناح/مهاجم" },
        { name: "شيكو بانزا", team: "الزمالك", pos: "مهاجم" }
    ];

    function showRandomPlayer() {
        if (hasRevealedPlayerThisTurn) {
            alert("لقد كشفت عن لاعب بالفعل هذا الدور! يرجى إتمام المزاد أولاً.");
            return;
        }
        let activePool = [];

        // يختار فقط من المجموعة التي عليها الدور
        if (pool_goalkeepers.length > 0) {
            activePool = pool_goalkeepers;
        } else if (pool_defenders.length > 0) {
            activePool = pool_defenders;
        } else if (pool_midfielders.length > 0) {
            activePool = pool_midfielders;
        } else if (pool_attackers.length > 0) {
            activePool = pool_attackers;
        } else {
            alert("تم انتهاء كافة اللاعبين المتاحين!");
            return;
        }

        // عشوائية كاملة داخل نفس المركز الحالي
        const index = Math.floor(Math.random() * activePool.length);
        currentPlayer = activePool[index];

        document.getElementById("current-player").innerHTML =
            `🎲 <b>${currentPlayer.name}</b><br><span style="color:#a2a8d3; font-size:16px;">(${currentPlayer.team} - ${currentPlayer.pos})</span>`;

        document.getElementById("bid_price_1").value = 0;
        document.getElementById("bid_price_2").value = 0;
        hasRevealedPlayerThisTurn = true;
        hasDrawnCardThisTurn = false;
    }

    function resolveAuction() {
        if (!currentPlayer) {
            alert("اعرض لاعباً عشوائياً أولاً!");
            return;
        }

        let bid1 = parseFloat(document.getElementById("bid_price_1").value) || 0;
        let bid2 = parseFloat(document.getElementById("bid_price_2").value) || 0;

        if (bid1 > budgets[1]) {
            alert("الميزانية المتبقية للاعب الأول لا تكفي!");
            return;
        }
        if (bid2 > budgets[2]) {
            alert("الميزانية المتبقية للاعب الثاني لا تكفي!");
            return;
        }

        if (bid1 === bid2) {
            alert("المزايدتان متساويتان! يجب أن تكون هناك مزايدة أعلى لتحديد الفائز.");
            return;
        }

        let winner = bid1 > bid2 ? 1 : 2;
        let winningPrice = bid1 > bid2 ? bid1 : bid2;
        let loser = bid1 > bid2 ? 2 : 1;

        // إضافة اللاعب للفائز وخصم السعر
        teams[winner].push({
            name: currentPlayer.name,
            team: currentPlayer.team,
            price: winningPrice
        });
        budgets[winner] -= winningPrice;

        // إزالة اللاعب الرئيسي من القائمة النشطة
        if (currentPlayer.pos === "حارس مرمى") {
            pool_goalkeepers = pool_goalkeepers.filter(p => p.name !== currentPlayer.name);
        } else if (currentPlayer.pos === "مدافع") {
            pool_defenders = pool_defenders.filter(p => p.name !== currentPlayer.name);
        } else if (currentPlayer.pos === "خط وسط") {
            pool_midfielders = pool_midfielders.filter(p => p.name !== currentPlayer.name);
        } else {
            pool_attackers = pool_attackers.filter(p => p.name !== currentPlayer.name);
        }

        // إعطاء اللاعب التالي في نفس القائمة للخاسر تلقائياً وبسعر 0M
        let activePool = [];
        if (currentPlayer.pos === "حارس مرمى") {
            activePool = pool_goalkeepers;
        } else if (currentPlayer.pos === "مدافع") {
            activePool = pool_defenders;
        } else if (currentPlayer.pos === "خط وسط") {
            activePool = pool_midfielders;
        } else {
            activePool = pool_attackers;
        }

        let autoPlayerText = "";
        if (activePool.length > 0) {
            let autoPlayer = activePool[0];
            teams[loser].push({
                name: autoPlayer.name,
                team: autoPlayer.team,
                price: 0
            });

            // إزالة اللاعب الممنوح تلقائياً من القائمة
            if (currentPlayer.pos === "حارس مرمى") {
                pool_goalkeepers = pool_goalkeepers.filter(p => p.name !== autoPlayer.name);
            } else if (currentPlayer.pos === "مدافع") {
                pool_defenders = pool_defenders.filter(p => p.name !== autoPlayer.name);
            } else if (currentPlayer.pos === "خط وسط") {
                pool_midfielders = pool_midfielders.filter(p => p.name !== autoPlayer.name);
            } else {
                pool_attackers = pool_attackers.filter(p => p.name !== autoPlayer.name);
            }

            autoPlayerText = `
                <div class="player-item" style="border-right: 4px dashed #ff007f;">
                    <span>⚽ ${autoPlayer.name} (${autoPlayer.team}) - تلقائي</span>
                    <span class="price-tag">0M</span>
                </div>
            `;
        }

        // تحديث القوائم في الواجهة
        document.getElementById("list_" + winner).innerHTML += `
            <div class="player-item">
                <span>👑 ${currentPlayer.name} (${currentPlayer.team})</span>
                <span class="price-tag">${winningPrice}M</span>
            </div>
        `;

        if (autoPlayerText) {
            document.getElementById("list_" + loser).innerHTML += autoPlayerText;
        }

        // إعادة ضبط حالة الدور وتدوير اللاعب النشط
        currentPlayer = null;
        hasRevealedPlayerThisTurn = false;
        hasDrawnCardThisTurn = false;
        
        document.getElementById("current-player").innerHTML = 'اضغط "🎲 لاعب عشوائي" للبدء';
        document.getElementById("bid_price_1").value = 0;
        document.getElementById("bid_price_2").value = 0;

        activePlayer = activePlayer === 1 ? 2 : 1;
        updateTurnUI();
    }
    function predictWinner(){

    if(teams[1].length === 0 || teams[2].length === 0){
        alert("يجب تكوين الفريقين أولاً.");
        return;
    }

    // تقييم بسيط حسب أسماء اللاعبين
    const ratings = {

        'محمد الشناوي':91,
        "مهدي سليمان":92,

        "محمود حمدي الونش":89,
        "حسام عبد المجيد":85,
        "محمود بنتايج":82,
        "محمد هاني":84,
        "ياسر إبراهيم":86,
        "ياسين مرعي":80,

        "عبد الله السعيد":93,
        "إمام عاشور":91,
        "مروان عطية":87,
        "محمد علي بن رمضان":88,
        "أحمد نبيل كوكا":84,
        "محمد شحاتة":81,
        "محمد إبراهيم":80,
        "آدم كايد":80,

        "ناصر منسي":89,
        "عدي الدباغ":97,
        "خوان بيزيرا":99,
        "شيكو بانزا":88,
        "تريزيجيه":90,
        "محمود حسن تريزيجيه":92,
        "أحمد سيد زيزو":65
    };

    let score1 = 0;
    let score2 = 0;

    teams[1].forEach(p=>{
        score1 += ratings[p.name] || 80;
    });

    teams[2].forEach(p=>{
        score2 += ratings[p.name] || 80;
    });

    let winner;
    let result;

    if(score1 > score2 + 5){
        winner="👑 اللاعب الأول";
        result=Math.floor(Math.random()*2+2)+"-"+Math.floor(Math.random()*2);
    }
    else if(score2 > score1 + 5){
        winner="👑 اللاعب الثاني";
        result=Math.floor(Math.random()*2+2)+"-"+Math.floor(Math.random()*2);
        let arr=result.split("-");
        result=arr[1]+"-"+arr[0];
    }
    else{
        winner="🤝 تعادل";
        result="1-1";
    }

    function scorers(team,goals){

        let attackers=team.filter(p=>

            p.name.includes("منسي")||
            p.name.includes("زيزو")||
            p.name.includes("شريف")||
            p.name.includes("تريزيجيه")||
            p.name.includes("الدباغ")||
            p.name.includes("بيزيرا")
        );

        if(attackers.length===0)
            attackers=team;

        let txt=[];

        for(let i=0;i<goals;i++){

            let p=attackers[Math.floor(Math.random()*attackers.length)];

            txt.push("⚽ "+p.name);

        }

        return txt.join("<br>");
    }

    let goals=result.split("-");

    document.getElementById("prediction").innerHTML=`
        <h2>🤖 توقع الذكاء الاصطناعي</h2>

        <h3>${winner}</h3>

        <h2>📊 النتيجة المتوقعة: ${result}</h2>

        <hr>

        <b>هدافو اللاعب الأول</b><br>
        ${scorers(teams[1],parseInt(goals[0]))}

        <br><br>

        <b>هدافو اللاعب الثاني</b><br>
        ${scorers(teams[2],parseInt(goals[1]))}
    `;
}
    // مصفوفات الكروت الجديدة لضمان 1/3 ربح و 2/3 خسارة بقيمة 1M
    const luckDeck = [
        { title: "ضربة حظ!", desc: "حصلت على 1M عملة مجانية.", icon: "💰", effect: 1 },
        { title: "غرامة مالية", desc: "دفع غرامة 1M عملة.", icon: "💸", effect: -1 },
        { title: "خصم إضافي", desc: "خصم 1M عملة من رصيدك.", icon: "🤦‍♂️", effect: -1 }
    ];

    // 2️⃣ الدالة المسؤولة عن السحب
    function drawCard() {
        if (hasDrawnCardThisTurn) {
            alert("لقد قمت بسحب كارت بالفعل هذا الدور!");
            return;
        }

        const cardElement = document.getElementById('luckCard');
        const iconElement = document.getElementById('cardIcon');
        const titleElement = document.getElementById('cardTitle');
        const descElement = document.getElementById('cardDesc');

        cardElement.classList.remove('good', 'bad', 'card-animate');
        
        // Trigger reflow to restart CSS animation
        void cardElement.offsetWidth;
        cardElement.classList.add('card-animate');

        // سحب كارت عشوائي من الثلاثة كروت المتاحة
        const randomIndex = Math.floor(Math.random() * 3);
        const selectedCard = luckDeck[randomIndex];

        // تطبيق تأثير الكارت وتحديث ميزانية اللاعب النشط
        budgets[activePlayer] += selectedCard.effect;
        budgets[activePlayer] = Math.max(0, budgets[activePlayer]); // منع الميزانية من الهبوط تحت 0

        hasDrawnCardThisTurn = true;

        if (selectedCard.effect > 0) {
            cardElement.classList.add('good');
        } else {
            cardElement.classList.add('bad');
        }

        // تحديث واجهة الكارت بالبيانات المحددة
        iconElement.textContent = selectedCard.icon;
        titleElement.textContent = `اللاعب ${activePlayer === 1 ? 'الأول' : 'الثاني'}: ${selectedCard.title}`;
        descElement.textContent = selectedCard.desc;

        // تحديث واجهة المستخدم بالرصيد الجديد
        updateTurnUI();
    }