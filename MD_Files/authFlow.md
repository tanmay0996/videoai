| Step | What Happens                                 | Who Handles It                           |
| ---- | -------------------------------------------- | ---------------------------------------- |
| 1    | User clicks `/dashboard`                     | 👉 Browser sends request                 |
| 2    | Middleware runs before page loads            | ✅ Checks token and allows/redirects      |
| 3    | Page loads if allowed                        | ✅ Server component may run               |
| 4    | `getServerSession()` checks again (optional) | ✅ Secures server logic or APIs           |
| 5    | React app mounts                             | `SessionProvider` provides session       |
| 6    | `useSession()` gives session to UI           | ✅ Used to show user info or login modals |


| Feature                     | `middleware`                  | `getServerSession()`                           | `useSession()` / `SessionProvider`               |
| --------------------------- | ----------------------------- | ---------------------------------------------- | ------------------------------------------------ |
| Runs on                     | Edge (before page)            | Server (backend)                               | Client (React)                                   |
| Used for                    | Route protection              | API/auth check                                 | UI rendering / conditional components            |
| Blocks page before loading? | ✅ Yes                         | ❌ No (only blocks logic)                       | ❌ No                                             |
| Can redirect?               | ✅ Yes                         | ✅ Yes (if in SSR)                              | ❌ No                                             |
| Can show UI/modal?          | ❌ No                          | ❌ No                                           | ✅ Yes                                            |
| Needs `SessionProvider`?    | ❌ No                          | ❌ No                                           | ✅ Yes                                            |
| Example usage               | Block `/dashboard` for guests | Allow only logged-in users to call `/api/user` | Show "Welcome back" or "Login to continue" popup |
