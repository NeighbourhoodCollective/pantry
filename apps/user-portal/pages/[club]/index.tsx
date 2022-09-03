import { useRouter } from 'next/dist/client/router';
import { Container, Row, Button } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { gql } from '@ts-gql/tag/no-transform';

import { DocumentBlock } from '../../components/DocumentBlock';

const SINGLE_ITEM_QUERY = gql`
  query GET_CLUB_PAGE_QUERY($slug: String!) {
    club(where: { slug: $slug }) {
      name
      description
      slug
      about {
        document
      }
      id
      subscriptions {
        id
        name
        slug
        description
        about {
          document
        }
      }
    }
  }
` as import('../../__generated__/ts-gql/GET_CLUB_PAGE_QUERY').type;

export default function ClubPage() {
  const router = useRouter();

  const { club } = router.query;
  if (!club || typeof club !== 'string') throw new Error('No club');

  const { loading, error, data } = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      slug: club,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.club) return <p>No club found for {club}</p>;
  return (
    <Container>
      <Row>
        <h2>{data.club.name}</h2>
        <DocumentBlock document={data?.club?.about?.document} />
        <Button
          variant="primary"
          type="button"
          onClick={() => router.push(`/${club}/subscriptions`)}
        >
          See {data.club.name} Membership Options
        </Button>
      </Row>
    </Container>
  );
}
