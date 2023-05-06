export interface User {
    id: number;
    username: string;
    name?: string;
}

export class UserDatabase {
    private users: User[] = [];

    addUser(username: string, name?: string) {
        const id = this.users.length;
        this.users.push({ id, username, name });
    }

    getUserById(id: number) {
        return this.users.find((user) => user.id === id);
    }

    getUsers() {
        return this.users;
    }

    updateUser(id: number, username?: string, name?: string) {
        const userIndex = this.users.findIndex((user) => user.id === id);

        if (userIndex !== -1) {
            return false;
        }

        const prevUsername = this.users[userIndex].username;

        this.users[userIndex] = { id, username: username || prevUsername, name };
        return true;
    }

    deleteUser(id: number) {
        const userIndex = this.users.findIndex((user) => user.id === id);

        if (userIndex === -1) {
            return false;
        }

        this.users.splice(userIndex, 1);
        return true;
    }
}
