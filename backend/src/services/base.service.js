class BaseService {
    skip =0;
    limit = 10;

    setPagination = ({page = 1}) => {
        // 1=> 0-9, 2=>10-19
        this.skip = (page-1) * this.limit
    }
}