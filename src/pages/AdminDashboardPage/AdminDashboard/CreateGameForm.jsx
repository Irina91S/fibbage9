import React from 'react';
import { Formik, Form, Field } from 'formik';

//TODO validation
const CreateGameForm = ({
  handleSubmit,
  handleCancel
}) => {

  return (
    <Formik 
      initialValues={{
        pincode: '',
        name: ''
      }}
      onSubmit={handleSubmit}
      render={() => ( 
        <Form>
          <Field 
            id="pincode"
            name="pincode"
            type="number"
            placeholder="game pincode" 
          />
          <br/>
          <Field 
            id="name"
            name="name"
            type="text"
            placeholder="game name"
          />
          <br/>
          <button type="button" onClick={handleCancel}>cancel</button>
          <button type="submit">create game</button>
        </Form>
      )}
    />
  );
};

export default CreateGameForm;