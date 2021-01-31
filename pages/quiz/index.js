import React from 'react';
import db from '../../db.json';
import Widget from '../../src/components/Widget';
import QuizLogo from '../../src/components/QuizLogo';
import QuizBackground from '../../src/components/QuizBackground';
import QuizContainer from '../../src/components/QuizContainer';
import Button from '../../src/components/Button';
import AF from '../../src/components/AlternativesForm';

function able(){
  let radios = document.getElementsByClassName('option');
  radios = Array.from(radios);
  radios.map((radio)=>{
    radio.disabled = false;
    radio.checked=false;
    return radio
  });
}
function disable()
{
  let radios = document.getElementsByClassName('option');
  radios = Array.from(radios);
  radios.map((radio)=>{radio.disabled = 'true'; return radio});
}

function ResultWidget({results, QQuestion}) {
  const pontos = results.reduce((somatoriaAtual, resultAtual)=>{
    const isAcerto = resultAtual === true;
    if(isAcerto)return somatoriaAtual-1;
    return somatoriaAtual+1;
  }, Number(QQuestion))

  return (
    <Widget>
      <Widget.Header>
        Tela de Resultado:
      </Widget.Header>

      <Widget.Content>
        <p>
          Pontos- {pontos}
        </p>
        Perguntas
        <ul>
          {results.map((result, i)=>(
            <li key={i}>
              {i+1}
              {result === true ? '- Acertou' : '- Errou'}
            </li>
          ))}
        </ul>
          {pontos>QQuestion && <p>Você não foi muito bem</p>}
          {pontos<QQuestion && pontos!==0 && <p>Você foi bem, que tal zerar o quiz agora?</p>}
          {pontos === 0 && <p>Parabéns! Quiz zerado</p>}
      </Widget.Content>
    </Widget>
  );
}

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        [Desafio do Loading]
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
  addResult
}) {
  const questionId = `question__${questionIndex}`;
  const [selectedAlternative, setSelectedAlternative] = React.useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false);
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;

  return (
    <Widget>
      <Widget.Header>
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>

      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>

        <AF
          onSubmit={(e) => {
            e.preventDefault();
            disable();
            setIsQuestionSubmited(true);
            setTimeout( ()=>{
              addResult(isCorrect);
              onSubmit();
              setIsQuestionSubmited(false);
              setSelectedAlternative(undefined);
              able();
            }, 1000);
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const alternativeStatus = isCorrect ? 'SUCCESS': 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;
            return (
              <Widget.Topic
                as="label"
                htmlFor={alternativeId}
                key={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmited && alternativeStatus}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  className="option"
                  disabled={false}
                  name={questionId}
                  onChange={()=>setSelectedAlternative(alternativeIndex)}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          <Button type="submit" disabled={!hasAlternativeSelected}>
            Confirmar
          </Button>
          {isQuestionSubmited && isCorrect && <p>Parabéns!! Tudo errado</p>}
          {isQuestionSubmited && !isCorrect && <p>Tudo errado mesmo</p>}
        </AF>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};
export default function QuizPage() {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const [results, setResults] = React.useState([]);
  const totalQuestions = db.questions.length;
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];

  function addResult(result){
    setResults([...results, result]);
  }

  React.useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 300);
  }, []);

  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmitQuiz}
            addResult={addResult}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && <ResultWidget results={results} QQuestion={totalQuestions}/>}
      </QuizContainer>
    </QuizBackground>
  );
}