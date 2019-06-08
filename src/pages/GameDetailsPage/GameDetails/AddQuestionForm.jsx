import React from 'react';
import { Formik, Form, Field } from 'formik';

//TODO validation
const AddQuestionsForm = ({handleSubmit}) => {

  return (
    <Formik
      initialValues={{
        question: '',
        answer: ''
      }}
      onSubmit={handleSubmit}
      render={() => ( 
        <Form>
          <Field 
            id="question"
            name="question"
            type="text"
            placeholder="question" 
          />
          <br/>
          <Field 
            id="answer"
            name="answer"
            type="text"
            placeholder="question answer"
          />
          <br/>
          <button type="submit">add question</button>
        </Form>
      )}
    />
  )
};

export default AddQuestionsForm;