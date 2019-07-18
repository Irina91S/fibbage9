import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { Input } from '../../../shared';

const InsertPincodeForm = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{
        pincode: ''
      }}
      onSubmit={onSubmit}
      render={({ errors }) => (
        <Form>
          <label htmlFor="pincode">Enter a PINCODE</label>
          <Input
            id="pincode"
            name="pincode"
            type="number"
            placeholder="PINCODE"
            errors={errors}
          />
          {/* <ErrorMessage component="span" name="pincode" /> */}
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
