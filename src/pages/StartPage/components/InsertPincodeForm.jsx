import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const InsertPincodeForm = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{
        pincode: ''
      }}
      onSubmit={onSubmit}
      render={() => (
        <Form>
          <label htmlFor="pincode">Enter a PINCODE</label>
          <Field
            id="pincode"
            name="pincode"
            type="number"
            placeholder="PINCODE"
          />
          <ErrorMessage component="error" name="pincode" />
          <button type="submit">JOIN GAME</button>

          <footer>
            In order to be able to join a game room you need to obtain a PINCODE
            from the creators of that game room.
          </footer>
        </Form>
      )}
    />
  );
};

export default InsertPincodeForm;
