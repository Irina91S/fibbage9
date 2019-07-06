import React from 'react';
import { Formik, Form, Field } from 'formik';

//TODO validation
const AddQuestionsForm = ({ handleSubmit }) => {
  return (
    <Formik
      initialValues={{
        question: '',
        answer: '',
        score: 0
      }}
      onSubmit={handleSubmit}
      render={({ values }) => ( 
        <Form>
          <Field 
            id="question"
            name="question"
            type="text"
            placeholder="Question"
            value={values.question}
          />
          <br/>
          <Field 
            id="answer"
            name="answer"
            type="text"
            placeholder="Question answer"
            value={values.answer}
          />
          <br/>
          <Field 
            id="score"
            name="score"
            type="number"
            placeholder="Question score"
            value={values.score}
          />
          <br/>
          <button type="submit">Add question</button>
        </Form>
      )}
    />
  )
};

export default AddQuestionsForm;