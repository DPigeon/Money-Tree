import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { User } from 'src/app/interfaces/user';
import { UserSearch } from 'src/app/interfaces/userSearch';

const fakeReponse: User = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  username: 'john1',
  avatarURL: '',
  coverPhotoURL: '',
  email: 'john1@gmail.com',
  score: 12,
  rank: 10000,
  balance: 223,
  alpacaApiKey: null,
};

const fakeUsers: UserSearch[] = [
  { id: 20, firstName: 'Money', lastName: 'Tree', email: 'money@tree.ca' },
];

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should format the user to the expected User model', () => {
    const transformedResponse = service.userFormatter(fakeReponse);
    expect(transformedResponse).toEqual(fakeReponse);
  });

  it('should format the user to the expected User Search model', () => {
    const transformedResponse = service.userSearchFormatter(fakeUsers);
    expect(transformedResponse).toEqual(fakeUsers);
  });
});
