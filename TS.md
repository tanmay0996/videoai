export interface IVideo {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
}
Purpose:
This is a TypeScript interface used to enforce type safety in your codebase.

Ensures consistent structure when working with video documents in your app logic, controllers, services, etc.

✅ Use Case:
Auto-completion in VSCode.

Compile-time error checking (e.g., catching if title is missing).

Reusability across functions or components that interact with video objects.




| Layer              | Purpose                     | Example Use                                   |
| ------------------ | --------------------------- | --------------------------------------------- |
| `VIDEO_DIMENSIONS` | Defaults for transformation | Used if no width/height is provided           |
| `IVideo`           | TypeScript interface        | Autocompletion and type safety                |
| `videoSchema`      | Mongoose schema             | Database schema + validation                  |
| `Video` model      | Connects schema to MongoDB  | Allows CRUD operations on `videos` collection |
