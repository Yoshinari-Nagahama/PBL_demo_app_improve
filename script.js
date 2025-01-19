// アンケートの質問データ
const questions = [
    {
        id: 1,
        text: '運転の自動化',
        description: 'あなたが免許を持ち、自動車を日常的に利用していると仮定してください。その際、自動運転車がすべての運転操作を行う状況を想定してください。'
    },
    {
        id: 2,
        text: '決済のデジタル化',
        description: 'コンビニやスーパー、レストランで、現金ではなくクレジットカードやスマートフォンによる決済が一般的になっている場面を想定してください。'
    },
    {
        id: 3,
        text: '家事の自動化',
        description: '自宅での掃除や料理、洗濯などの家事を、ロボットやAIが完全に自動で行う状況を想定してください。'
    },
    {
        id: 4,
        text: '医療診断のデジタル化',
        description: '病院で医師ではなくAIが診察を行い、診断結果を提示して治療法を提案する場面を想定してください。'
    },
    {
        id: 5,
        text: '教育のデジタル化',
        description: '学校の授業がAIによって進行される、もしくはオンラインでのみ授業が行われる教育環境を想定してください。'
    },
    {
        id: 6,
        text: '物流の自動化',
        description: 'ネットショッピングで注文した商品が、人間ではなくドローンや自動運転車によって自宅まで配送される場面を想定してください。'
    },
    {
        id: 7,
        text: '農業のデジタル化',
        description: 'AIやセンサー技術を活用した農業機械が、種まきや収穫の作業をサポートする場面を想定してください。'
    },
    {
        id: 8,
        text: '人事管理のデジタル化',
        description: 'あなたが働いている職場で、AIが仕事の評価や昇進の決定を行う場面を想定してください。'
    },
    {
        id: 9,
        text: '法律業務のデジタル化',
        description: 'あなたが社会人として働いている際、弁護士に依頼せず、AIが契約書の作成や法的助言を提供する場面を想定してください。'
    },
    {
        id: 10,
        text: '芸術のデジタル化',
        description: '展覧会やコンサートで発表される作品が、すべてAIによって制作されたものだとする場面を想定してください。'
    }
];

// ユーザーの回答を保存する配列
let userAnswers = [];

// DOM要素の取得
const startScreen = document.getElementById('start-screen');
const surveyScreen = document.getElementById('survey-screen');
const questionsContainer = document.getElementById('questions');
const resultButtons = document.getElementById('result-buttons');
const comparisonScreen = document.getElementById('comparison-screen');
const trendScreen = document.getElementById('trend-screen');

// アンケート開始ボタンのイベントリスナー
document.getElementById('start-button').addEventListener('click', () => {
    startScreen.classList.add('hidden');
    surveyScreen.classList.remove('hidden');
    renderQuestions();
});

// 質問を画面に表示する関数
function renderQuestions() {
    questionsContainer.innerHTML = questions.map((question, index) => `
        <div class="question-container mb-8 p-6 bg-gray-50 rounded-lg" data-question="${question.id}">
            <h3 class="text-xl font-semibold mb-2">${question.text}</h3>
            <p class="text-gray-600 mb-4">${question.description}</p>
            <div class="flex justify-center space-x-4">
                <button class="answer-btn yes-btn w-32 py-3 rounded-full bg-gray-200 hover:bg-yes-blue hover:text-white transition-colors"
                        onclick="handleAnswer(${question.id}, true)">
                    Yes
                </button>
                <button class="answer-btn no-btn w-32 py-3 rounded-full bg-gray-200 hover:bg-no-red hover:text-white transition-colors"
                        onclick="handleAnswer(${question.id}, false)">
                    No
                </button>
            </div>
        </div>
    `).join('');
}

// 回答を処理する関数
function handleAnswer(questionId, isYes) {
    const questionContainer = document.querySelector(`[data-question="${questionId}"]`);
    const yesBtn = questionContainer.querySelector('.yes-btn');
    const noBtn = questionContainer.querySelector('.no-btn');

    // 以前の回答があれば更新、なければ新規追加
    const existingAnswerIndex = userAnswers.findIndex(a => a.questionId === questionId);
    if (existingAnswerIndex !== -1) {
        userAnswers[existingAnswerIndex].answer = isYes;
    } else {
        userAnswers.push({ questionId, answer: isYes });
    }

    // ボタンのスタイルを更新
    yesBtn.className = `answer-btn yes-btn w-32 py-3 rounded-full ${isYes ? 'bg-yes-blue text-white shadow-lg transform scale-105' : 'bg-gray-200'} transition-all duration-200`;
    noBtn.className = `answer-btn no-btn w-32 py-3 rounded-full ${!isYes ? 'bg-no-red text-white shadow-lg transform scale-105' : 'bg-gray-200'} transition-all duration-200`;

    // アニメーション効果を追加
    const activeBtn = isYes ? yesBtn : noBtn;
    activeBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        activeBtn.style.transform = 'scale(1.05)';
    }, 100);

    // 全ての質問に回答されたかチェック
    if (userAnswers.length === questions.length) {
        resultButtons.classList.remove('hidden');
    }
}

// 他人と比較するボタンのイベントリスナー
document.getElementById('compare-button').addEventListener('click', () => {
    surveyScreen.classList.add('hidden');
    comparisonScreen.classList.remove('hidden');
    trendScreen.classList.add('hidden');
    showComparisonWithNewResponse();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 全体傾向を見るボタンのイベントリスナー
document.getElementById('trend-button').addEventListener('click', () => {
    surveyScreen.classList.add('hidden');
    comparisonScreen.classList.add('hidden');
    trendScreen.classList.remove('hidden');
    showTrends();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 他人との比較を表示する関数
function showComparisonWithNewResponse() {
    const randomResponse = surveyResponses[Math.floor(Math.random() * surveyResponses.length)];
    const existingContent = document.querySelector('.comparison-content');
    
    const newContent = `
        <div class="comparison-content opacity-0 transform translate-x-full transition-all duration-500">
            <div class="grid grid-cols-1 gap-6">
                ${questions.map((q, index) => `
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <h3 class="text-lg font-semibold mb-2">${q.text}</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="text-center">
                                <p class="mb-2 font-medium">あなたの回答</p>
                                <div class="inline-block px-6 py-2 rounded-full ${userAnswers[index].answer ? 'bg-yes-blue text-white' : 'bg-no-red text-white'}">
                                    ${userAnswers[index].answer ? 'Yes' : 'No'}
                                </div>
                            </div>
                            <div class="text-center">
                                <p class="mb-2 font-medium">他のユーザーの回答</p>
                                <div class="inline-block px-6 py-2 rounded-full ${randomResponse.answers[index] ? 'bg-yes-blue text-white' : 'bg-no-red text-white'}">
                                    ${randomResponse.answers[index] ? 'Yes' : 'No'}
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    if (existingContent) {
        // 既存のコンテンツをフェードアウト
        existingContent.classList.add('opacity-0', 'transform', '-translate-x-full');
        
        setTimeout(() => {
            comparisonScreen.innerHTML = `
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h2 class="text-2xl font-bold mb-6 text-center">回答の比較</h2>
                    ${newContent}
                    <div class="mt-8 text-center space-y-4">
                        <button onclick="showComparisonWithNewResponse()" class="btn-primary bg-yes-blue text-white font-bold py-3 px-6 rounded-full hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all duration-200">
                            他の人の結果と比べる
                        </button>
                        <div>
                            <button onclick="showTrendsFromComparison()" class="btn-primary bg-yes-blue text-white font-bold py-3 px-6 rounded-full hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all duration-200">
                                全体の傾向と比較する
                            </button>
                        </div>
                        <div>
                            <button onclick="returnToSurvey()" class="btn-primary bg-gray-600 text-white font-bold py-3 px-6 rounded-full hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-200">
                                アンケート画面に戻る
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // 新しいコンテンツをフェードイン
            setTimeout(() => {
                const newContentElement = document.querySelector('.comparison-content');
                newContentElement.classList.remove('opacity-0', 'translate-x-full');
            }, 50);
        }, 500);
    } else {
        // 初回表示
        comparisonScreen.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-2xl font-bold mb-6 text-center">回答の比較</h2>
                ${newContent}
                <div class="mt-8 text-center space-y-4">
                    <button onclick="showComparisonWithNewResponse()" class="btn-primary bg-yes-blue text-white font-bold py-3 px-6 rounded-full hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all duration-200">
                        他の人の結果と比べる
                    </button>
                    <div>
                        <button onclick="showTrendsFromComparison()" class="btn-primary bg-yes-blue text-white font-bold py-3 px-6 rounded-full hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all duration-200">
                            全体の傾向と比較する
                        </button>
                    </div>
                    <div>
                        <button onclick="returnToSurvey()" class="btn-primary bg-gray-600 text-white font-bold py-3 px-6 rounded-full hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-200">
                            アンケート画面に戻る
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // 初回表示のアニメーション
        setTimeout(() => {
            const contentElement = document.querySelector('.comparison-content');
            contentElement.classList.remove('opacity-0', 'translate-x-full');
        }, 50);
    }
}

// 比較画面から全体傾向画面に移動する関数
function showTrendsFromComparison() {
    surveyScreen.classList.add('hidden');
    comparisonScreen.classList.add('hidden');
    trendScreen.classList.remove('hidden');
    showTrends();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 全体傾向を表示する関数
function showTrends() {
    const stats = window.surveyStats;

    trendScreen.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-2xl font-bold mb-4 text-center">全体の回答傾向</h2>
            <p class="text-gray-600 text-center mb-6">※ 色が付いている側（青または赤）があなたの回答した答えです</p>
            <div class="space-y-6">
                ${questions.map((q, index) => {
                    const stat = stats[index];
                    const userAnswer = userAnswers[index].answer;
                    return `
                        <div class="p-4 bg-gray-50 rounded-lg">
                            <h3 class="text-lg font-semibold mb-2">${q.text}</h3>
                            <div class="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                                <div class="absolute left-0 top-0 h-full ${userAnswer ? 'bg-yes-blue' : 'bg-gray-400'}" 
                                     style="width: ${stat.yesPercentage}%"></div>
                                <div class="absolute right-0 top-0 h-full ${!userAnswer ? 'bg-no-red' : 'bg-gray-400'}" 
                                     style="width: ${stat.noPercentage}%"></div>
                                <div class="absolute inset-0 flex items-center justify-between px-4 text-white font-medium">
                                    <span>Yes ${stat.yesPercentage}%</span>
                                    <span>No ${stat.noPercentage}%</span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="mt-8 text-center">
                <button onclick="returnToSurvey()" class="btn-primary bg-gray-600 text-white font-bold py-3 px-6 rounded-full hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-200">
                    アンケート画面に戻る
                </button>
            </div>
        </div>
    `;
}

// アンケート画面に戻る関数
function returnToSurvey() {
    surveyScreen.classList.remove('hidden');
    comparisonScreen.classList.add('hidden');
    trendScreen.classList.add('hidden');
}
