// @flow

import React from 'react';
import type { SubmissionEntity } from 'app/reducers/surveySubmissions';
import type { SurveyEntity } from 'app/reducers/surveys';
import type { QuestionEntity } from 'app/reducers/surveys';
import Results from './Results';
import styles from '../surveys.css';

type Props = {
  submissions: Array<SubmissionEntity>,
  addSubmission: SubmissionEntity => Promise<*>,
  survey: SurveyEntity,
  hideAnswer: (number, number, number) => Promise<*>,
  showAnswer: (number, number, number) => Promise<*>
};

const SubmissionSummary = ({
  submissions,
  survey,
  hideAnswer,
  showAnswer
}: Props) => {
  const generateTextAnswers = question => {
    const texts = submissions
      .map(submission => {
        const answer = submission.answers.find(
          answer => answer.question.id === question.id
        );
        return (
          answer && (
            <li
              key={answer.id}
              className={styles.adminAnswer}
              style={{
                backgroundColor: answer.hideFromPublic && '#eee',
                padding: answer.hideFromPublic && '5px'
              }}
            >
              <span>{answer.answerText}</span>
              {answer.hideFromPublic ? (
                <a
                  onClick={() =>
                    showAnswer(survey.id, submission.id, answer.id)
                  }
                >
                  vis
                </a>
              ) : (
                <a
                  onClick={() =>
                    hideAnswer(survey.id, submission.id, answer.id)
                  }
                >
                  skjul
                </a>
              )}
            </li>
          )
        );
      })
      .filter(Boolean);

    return texts.length === 0 ? <i>Ingen svar.</i> : texts;
  };

  const generateQuestionData = (question: QuestionEntity) => {
    const questionData = [];

    question.options.map(option => {
      const selectedCount = submissions
        .map(
          submission =>
            submission.answers.find(
              answer => answer.question.id === question.id
            ) || {}
        )
        .filter(answer =>
          (answer.selectedOptions || []).find(o => o === option.id)
        ).length;

      questionData.push({
        option: option.optionText,
        selections: selectedCount
      });
    });
    return questionData;
  };

  const graphData = {};
  survey.questions.map(question => {
    graphData[question.id] = generateQuestionData(question);
  });

  return (
    <Results
      survey={survey}
      graphData={graphData}
      generateTextAnswers={generateTextAnswers}
      numberOfSubmissions={submissions.length}
    />
  );
};

export default SubmissionSummary;
