import Head from "next/head";
import { MongoClient, ObjectId } from "mongodb";

import MeetupDetail from "../../components/meetups/MeetupDetail";

const MeetupDetails = (props) => {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        descripton={props.meetupData.description}
        title={props.meetupData.title}
        address={props.meetupData.address}
      />
    </>
  );
};
// if using getStaticProps in a dynamic page must export getStaticPaths
// tells next js for which dynamic parameter values this page should be pregenerated

export const getStaticPaths = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://admin-smithdc:BdiyNjdBKqvZaPrC@meetupdatabase.fwbit.mongodb.net/meetups?retryWrites=true&w=majority",
    { useUnifiedTopology: true }
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();
  // generate array dynamically
  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
};

export const getStaticProps = async (context) => {
  // fetch data for single meet up
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://admin-smithdc:BdiyNjdBKqvZaPrC@meetupdatabase.fwbit.mongodb.net/meetups?retryWrites=true&w=majority",
    { useUnifiedTopology: true }
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        description: selectedMeetup.description,
        image: selectedMeetup.image,
        address: selectedMeetup.address,
      },
    },
  };
};

export default MeetupDetails;
