import Head from "next/head";
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";

const HomePage = (props) => {
  return (
    <>
      <Head>
        <title>Meetups</title>
        <meta
          name='description'
          content='A meetup application for meeting new peopl'
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
};
// use getStaticProps unless your page gets data updates multiple times a second
export const getStaticProps = async () => {
  // fetch data from api or database
  // does not show up on client side
  // must return object
  const client = await MongoClient.connect(
    "mongodb+srv://admin-smithdc:BdiyNjdBKqvZaPrC@meetupdatabase.fwbit.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    // regenerates every 10 seconds on the server and new pages replace old pages
    revalidate: 1,
  };
};

// alternative to getStateProps
// Good for when your app gets frequent data updates (+1 update per second)

// export const getServerSideProps = async (context) => {
//     // fetch data from an API
//     // can perform operations that would be done on a server

//     const req = context.req;
//     const res = context.res;

//     return {
//         props: {
//             meetups: DUMMY_MEETUPS,
//         }
//     }
// }

export default HomePage;
