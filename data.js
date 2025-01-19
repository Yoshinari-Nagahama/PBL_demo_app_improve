// CSVデータを解析して保存する配列
const surveyResponses = [
    // CSVから読み込んだデータが入ります
];

// 全体の回答傾向を計算する関数
function calculateStats() {
    const totalResponses = surveyResponses.length;
    const yesCountPerQuestion = Array(10).fill(0);
    
    surveyResponses.forEach(response => {
        response.answers.forEach((answer, index) => {
            if (answer) yesCountPerQuestion[index]++;
        });
    });
    
    return yesCountPerQuestion.map(yesCount => ({
        yesPercentage: Math.round((yesCount / totalResponses) * 100),
        noPercentage: Math.round(((totalResponses - yesCount) / totalResponses) * 100)
    }));
}

// CSVデータを解析して回答を配列に変換
function parseCSVData(csvText) {
    const lines = csvText.split('\n');
    // ヘッダーをスキップ
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const columns = line.split(',');
        if (columns.length < 13) continue; // タイムスタンプ、性別、年齢、10個の回答
        
        // 回答のみを抽出（3番目のカラムから）
        const answers = columns.slice(3, 13).map(answer => 
            answer.includes('肯定的') || answer.includes('Yes')
        );
        
        surveyResponses.push({
            id: `response_${i}`,
            answers: answers
        });
    }
}

// CSVファイルを読み込む
fetch('PBL_demo_app_use.csv')
    .then(response => response.text())
    .then(csvText => {
        parseCSVData(csvText);
        window.surveyStats = calculateStats();
    })
    .catch(error => console.error('Error loading survey data:', error));
