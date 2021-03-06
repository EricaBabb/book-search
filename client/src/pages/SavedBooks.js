import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
//Import mutations and queries from apollo
import {useMutation, useQuery} from '@apollo/react-hooks';


import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
//Import REMOVE_BOOK mutation and GET_ME query
import { REMOVE_BOOK } from '../utils/mutations';
import { GET_ME } from '../utils/queries';

const SavedBooks = () => {
  
  // const [userData, setUserData] = useState({});
  // use useQuery hook to make query request
  //loading property since it is async req
  //Once loaded, info stored in destructured data prop
  const { loading, data } = useQuery(GET_ME);
  //loading property = ablility to conditionally render data based on whether or not there is data to even display

  //optional chaining = if data exists, store userData; If data is undefined, save an empty array to the userData component
  const userData = data?.me || [];


  const [removeBook] = useMutation(REMOVE_BOOK);

  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;


  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      //using the imported useMutation hook
      await removeBook({
        variables: {bookId: bookId}});
      // setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
