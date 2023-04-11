import { TrackPagination } from "../models/TrackPagination";

export class tracksService {
  static getListByPage = async (page: string, pageSize: string): Promise<TrackPagination> => {
    const url = new URL('https://musicality-api.azurewebsites.net/Track/GetByPage');
    url.searchParams.set('page', page);
    url.searchParams.set('pageSize', pageSize);

    const response = await fetch(url).catch(() => { });

    return (response?.ok ?? false) ? await response?.json() : { total: 0 };
  }
}