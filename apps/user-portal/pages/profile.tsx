import { Button, Form, Alert, Row } from 'react-bootstrap';
import { useState } from 'react';

import { useMutation } from '@apollo/client';
// import { useRouter } from 'next/dist/client/router';
import { gql } from '@ts-gql/tag/no-transform';
import nProgress from 'nprogress';
// import getConfig from 'next/config';
import { CURRENT_USER_QUERY, useForm, useUser } from '../lib/form';
import { User } from '../components/forms';
import { SigninButton } from '../components/SigninButton';
import { ManageStripeButton } from '../components/ManageStripeButton';

const UPDATE_USER_MUTATION = gql`
  mutation UPDATE_USER_MUTATION(
    $userId: ID!
    $email: String!
    $name: String!
    $phone: String
    $prefName: String
    $householdMembers: JSON
  ) {
    updateUser(
      where: { id: $userId }
      data: {
        email: $email
        name: $name
        preferredName: $prefName
        phone: $phone
        householdMembers: $householdMembers
      }
    ) {
      id
    }
  }
` as import('../__generated__/ts-gql/UPDATE_USER_MUTATION').type;

export default function Profile() {
  const user = useUser();
  const [loading, setLoading] = useState(false);

  const {
    inputs,
    handleChange,
  }: {
    inputs: any;
    handleChange: any;
    resetForm: any;
    handleStageButton: any;
    clearForm: any;
  } = useForm({
    email: user?.email || '',
    name: user?.name || '',
    prefName: user?.preferredName || '',
    phone: user?.phone || '',
    householdMembers: JSON.stringify(user?.householdMembers || []),
  });

  const [updateUser] = useMutation(UPDATE_USER_MUTATION, {
    // variables: inputs,
    // refetch the currently logged in user
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    nProgress.start();
    await updateUser({
      variables: {
        userId: user.id,
        ...inputs,
        householdMembers: JSON.parse(inputs.householdMembers),
      },
    });
    setLoading(false);
    nProgress.done();
  }

  return (
    <>
      {loading && <Alert variant="info">Loading...</Alert>}
      {!user ? (
        <SigninButton />
      ) : (
        <>
          <h3> Update Your Profile</h3>
          <Form onSubmit={async (e) => handleSubmit(e)}>
            <User inputs={inputs} handleChange={handleChange} />
            <br />
            <Button type="submit">Update...</Button>
          </Form>

          {user.memberships.length > 0 &&
            user.memberships.map((membership: any) => (
              <Row key={membership.id}>
                <br />
                <h2>{membership.variation.name}</h2>
                <p>
                  Status - {membership.status}
                  <br />
                  Renewal Date - {membership.renewalDate}
                </p>
                <ManageStripeButton />
                <br />
              </Row>
            ))}
        </>
      )}
    </>
  );
}
