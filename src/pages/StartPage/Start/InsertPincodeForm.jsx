import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const InsertPincodeForm = ({onSubmit}) => {
  return (
    <Formik 
      initialValues={{
        pincode: ''
      }}
      onSubmit={onSubmit}
      render={() => (
        <Form>
          <Field 
            id="pincode"
            name="pincode"
            type="number" 
            placeholder="gameroom pincode"
          />
          <ErrorMessage name="pincode"/>
        </Form>
      )}
    />
  );
};

export default InsertPincodeForm;